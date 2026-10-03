(() => {
  "use strict";

  const directory = (name, children = [], extra = {}) => ({ name, type: "directory", children, ...extra });
  const file = (name, extra = {}) => ({ name, type: "file", ...extra });
  const fileSystem = directory("/", [
    directory("bin", [file("bash"), file("ls"), file("pwd")], { description: "Essential command tools" }),
    directory("etc", [file("hostname"), file("hosts"), directory("secure", [file("building-policy.txt")], { restricted: true, description: "Administrator only" })], { description: "System settings" }),
    directory("home", [
      directory("student", [directory("Desktop", [file("welcome.txt")]), directory("Documents", [file("linux_notes.txt"), file("lab_report.md")]), directory("Downloads", []), directory("Pictures", [file("campus-photo.jpg")])], { owner: "student", home: true, description: "Your apartment" }),
      directory("bobby", [directory("Desktop", []), directory("Documents", [file("todo.txt")]), directory("Downloads", [])], { owner: "bobby", home: true, description: "Bobby's apartment" })
    ], { description: "Resident apartments" }),
    directory("media", [directory("student", [], { description: "Your connected devices" })], { description: "Removable media" }),
    directory("mnt", [directory("nas", [], { description: "Network storage mount point", restricted: true, deviceMount: "nas" })], { description: "Additional mount points" }),
    directory("restricted", [file("private-records.txt")], { restricted: true, description: "Staff only" }),
    directory("tmp", [file("temporary-file.tmp")], { description: "Temporary files" }),
    directory("usr", [directory("bin", [file("nano"), file("python3")]), directory("share", [directory("doc", [file("readme.txt")])])], { description: "Shared programs and resources" }),
    directory("var", [directory("log", [file("system.log")]), directory("www", [file("index.html")])], { description: "Changing system data" })
  ]);

  const currentUser = "student";
  const homePath = `/home/${currentUser}`;
  const deviceDefinitions = [
    { id: "usb", name: "USB Flash Drive", shortName: "USB", deviceType: "flash-drive", mountPoint: "/media/student/USB", icon: "fa-hard-drive", contents: [directory("assignments", [file("week-1.txt")]), file("linux_notes.txt"), directory("backup", [file("photos.zip")])] },
    { id: "cd", name: "CD", shortName: "CD", deviceType: "disc", mountPoint: "/media/student/CD", icon: "fa-compact-disc", contents: [directory("documentation", [file("getting-started.pdf")]), directory("installer", [file("setup.run")]), file("README.txt")] },
    { id: "nas", name: "Network Attached Storage", shortName: "NAS", deviceType: "network-storage", mountPoint: "/mnt/nas", icon: "fa-server", contents: [directory("shared", [file("class-schedule.pdf")]), directory("public", [file("welcome.txt")]), directory("backups", [])] },
    { id: "floppy", name: "Floppy Disk", shortName: "floppy", deviceType: "floppy-disk", mountPoint: "/media/student/floppy", icon: "fa-floppy-disk", contents: [file("README.txt"), directory("old_files", [file("notes.txt")]), file("assignment.txt")] }
  ];

  const state = {
    currentDirectory: homePath,
    previousDirectory: null,
    fileSystem,
    commandHistory: [],
    historyIndex: 0,
    externalDevices: Object.fromEntries(deviceDefinitions.map((device) => [device.id, { ...device, connected: false, mounted: false }])),
    theme: localStorage.getItem("linux-apartment-theme") || "light",
    commandReferenceVisible: localStorage.getItem("linux-apartment-reference") !== "hidden",
    helpMode: true
  };

  const $ = (selector) => document.querySelector(selector);
  const scene = $("#complexScene");
  const output = $("#terminalOutput");
  const input = $("#commandInput");
  const form = $("#terminalForm");
  const outputHistoryLimit = 150;

  function parts(path) { return path.split("/").filter(Boolean); }
  function normalize(path, base = state.currentDirectory) {
    const stack = path.startsWith("/") ? [] : parts(base);
    for (const segment of path.split("/")) {
      if (!segment || segment === ".") continue;
      if (segment === "..") stack.pop();
      else stack.push(segment);
    }
    return `/${stack.join("/")}`;
  }
  function nodeAt(path) {
    let node = state.fileSystem;
    for (const part of parts(path)) {
      if (node?.type !== "directory") return null;
      node = node.children.find((child) => child.name === part);
      if (!node) return null;
    }
    return node;
  }
  function parentPath(path) {
    if (path === "/") return "/";
    const bits = parts(path);
    bits.pop();
    return `/${bits.join("/")}`;
  }
  function isInside(path, parent) { return path === parent || path.startsWith(`${parent}/`); }
  function pathIsAccessible(path) {
    const node = nodeAt(path);
    if (!node) return false;
    let probe = path;
    while (probe !== "/") {
      const ancestor = nodeAt(probe);
      if (ancestor?.restricted && !isInside(path, homePath)) return false;
      probe = parentPath(probe);
    }
    const mount = Object.values(state.externalDevices).find((device) => path === device.mountPoint || isInside(path, device.mountPoint));
    return !mount || (mount.connected && mount.mounted);
  }
  function displayPath(path = state.currentDirectory) {
    if (path === homePath) return "~";
    if (isInside(path, homePath)) return `~${path.slice(homePath.length)}`;
    return path;
  }
  function promptText() { return `${currentUser}@linux:${displayPath()}$`; }
  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function appendOutput(command, result, isError = false, commandPath = state.currentDirectory) {
    const row = createElement("div", "terminal-entry");
    const commandLine = createElement("div", "terminal-command-line");
    commandLine.append(createElement("span", "output-prompt", promptForPath(commandPath)), createElement("span", "output-command", command));
    const resultBlock = createElement("pre", `terminal-result${isError ? " is-error" : ""}`, result);
    row.append(commandLine, resultBlock);
    output.append(row);
    while (output.children.length > outputHistoryLimit) output.firstElementChild.remove();
    output.scrollTop = output.scrollHeight;
  }
  function promptForPath(path) { return `${currentUser}@linux:${displayPath(path)}$ `; }
  function updatePrompt() {
    $("#promptLabel").textContent = promptText();
    $("#currentPath").textContent = state.currentDirectory;
    $("#visualPath").textContent = state.currentDirectory;
    $("#parentButton").disabled = state.currentDirectory === "/";
  }
  function navigate(path) {
    if (!pathIsAccessible(path)) return false;
    if (path !== state.currentDirectory) {
      state.previousDirectory = state.currentDirectory;
      state.currentDirectory = path;
    }
    render();
    return true;
  }
  function iconForNode(node) {
    if (node.type === "file") return node.name.endsWith(".jpg") ? "fa-image" : node.name.endsWith(".pdf") ? "fa-file-pdf" : "fa-file-lines";
    if (node.restricted) return "fa-lock";
    if (node.home && node.owner === currentUser) return "fa-house-user";
    if (node.home) return "fa-house";
    if (node.deviceType === "flash-drive") return "fa-hard-drive";
    if (node.deviceType === "disc") return "fa-compact-disc";
    if (node.deviceType === "network-storage") return "fa-server";
    if (node.deviceType === "floppy-disk") return "fa-floppy-disk";
    return "fa-folder";
  }
  function renderScene() {
    scene.replaceChildren();
    const current = nodeAt(state.currentDirectory);
    if (!current) return;
    const parent = parentPath(state.currentDirectory);
    if (state.currentDirectory !== "/") {
      const breadcrumb = createElement("div", "scene-breadcrumb");
      breadcrumb.append(createElement("span", "breadcrumb-label", "ON THIS FLOOR"));
      const parentButton = createElement("button", "breadcrumb-parent", `↑ ${parent === "/" ? "Root building" : parent.split("/").pop()}`);
      parentButton.type = "button";
      parentButton.addEventListener("click", () => navigate(parent));
      breadcrumb.append(parentButton);
      scene.append(breadcrumb);
    } else {
      const rootLabel = createElement("div", "scene-breadcrumb");
      rootLabel.append(createElement("span", "breadcrumb-label", "THE WHOLE PROPERTY"), createElement("span", "scene-description", "Choose a place in the building to explore."));
      scene.append(rootLabel);
    }
    const grid = createElement("div", "directory-grid");
    const entries = current.children || [];
    if (!entries.length) grid.append(createElement("div", "empty-room", "This place is empty for now."));
    for (const child of entries) {
      const childPath = normalize(child.name, state.currentDirectory);
      const reachable = pathIsAccessible(childPath);
      const card = createElement(child.type === "directory" ? "button" : "div", `place-card${child.type === "file" ? " file-card" : ""}${!reachable && child.type === "directory" ? " place-locked" : ""}${child.home && child.owner === currentUser ? " own-home" : ""}${child.deviceType ? " device-place" : ""}`);
      if (child.type === "directory") {
        card.type = "button";
        card.disabled = !reachable;
        card.setAttribute("aria-label", `${child.name}, directory${reachable ? ", open" : ", restricted or disconnected"}`);
        card.addEventListener("click", () => {
          if (reachable) navigate(childPath);
          else showToast(child.restricted ? "This area is restricted to the building administrator." : "Connect this device before entering it.", "warning");
        });
      }
      const cardTop = createElement("div", "place-card-top");
      const iconWrap = createElement("span", `place-icon${child.type === "file" ? " file-icon" : ""}`);
      const icon = document.createElement("i"); icon.className = `fa-solid ${iconForNode(child)}`; icon.setAttribute("aria-hidden", "true"); iconWrap.append(icon);
      cardTop.append(iconWrap);
      if (child.home && child.owner === currentUser) cardTop.append(createElement("span", "you-tag", "YOU"));
      else if (child.restricted) cardTop.append(createElement("span", "locked-tag", "RESTRICTED"));
      else if (child.deviceType && !reachable) cardTop.append(createElement("span", "locked-tag", "NOT MOUNTED"));
      const title = createElement("strong", "place-name", child.name);
      const subtitle = createElement("span", "place-description", child.description || (child.type === "file" ? "File" : `${child.children?.length || 0} ${child.children?.length === 1 ? "item" : "items"}`));
      card.append(cardTop, title, subtitle);
      if (child.type === "directory" && reachable) {
        const enter = createElement("span", "enter-hint", "Enter ");
        const arrow = document.createElement("i"); arrow.className = "fa-solid fa-arrow-right"; arrow.setAttribute("aria-hidden", "true");
        enter.append(arrow);
        card.append(enter);
      }
      grid.append(card);
    }
    scene.append(grid);
    const character = createElement("div", "character-marker");
    const characterIcon = document.createElement("i"); characterIcon.className = "fa-solid fa-person-walking"; characterIcon.setAttribute("aria-hidden", "true");
    character.append(characterIcon, createElement("span", "character-caption", `You’re in ${current.name === "/" ? "the building" : current.name}`));
    scene.append(character);
  }
  function renderDevices() {
    const container = $("#deviceButtons");
    container.replaceChildren();
    const devices = Object.values(state.externalDevices);
    const connected = devices.filter((device) => device.connected).length;
    $("#deviceCount").textContent = `${connected} connected`;
    for (const device of devices) {
      const button = createElement("button", `device-button${device.connected ? " is-connected" : ""}`);
      button.type = "button";
      button.setAttribute("aria-label", `${device.connected ? "Disconnect" : "Connect"} ${device.name}`);
      const iconWrap = createElement("span", "device-icon");
      const icon = document.createElement("i"); icon.className = `fa-solid ${device.icon}`; icon.setAttribute("aria-hidden", "true"); iconWrap.append(icon);
      const copy = createElement("span", "device-copy");
      copy.append(createElement("strong", "", device.name), createElement("small", "", device.connected ? device.mountPoint : "Not connected"));
      const action = createElement("span", "device-action", device.connected ? "Connected" : "Connect");
      button.append(iconWrap, copy, action);
      button.addEventListener("click", () => device.connected ? disconnectDevice(device.id) : connectDevice(device.id));
      container.append(button);
    }
  }
  function render() { updatePrompt(); renderScene(); renderDevices(); }

  function tokenize(command) {
    const matches = command.match(/"([^"\\]*(?:\\.[^"\\]*)*)"|'([^']*)'|(\S+)/g) || [];
    return matches.map((token) => {
      if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) return token.slice(1, -1);
      return token;
    });
  }
  function expandPath(path) {
    if (path === "~") return homePath;
    if (path.startsWith("~/")) return `${homePath}${path.slice(1)}`;
    return path;
  }
  function resolveExistingPath(path) {
    const expanded = expandPath(path);
    return normalize(expanded, state.currentDirectory);
  }
  function canList(path) { return pathIsAccessible(path) && nodeAt(path)?.type === "directory"; }
  function listDirectory(path, detailed = false, showHidden = false) {
    const node = nodeAt(path);
    if (!node || node.type !== "directory") return null;
    const entries = (node.children || []).filter((entry) => showHidden || !entry.name.startsWith("."));
    if (!entries.length) return "";
    return detailed ? entries.map((entry) => `${entry.type === "directory" ? "drwxr-xr-x" : "-rw-r--r--"}  ${entry.owner || currentUser}  ${entry.name}`).join("\n") : entries.map((entry) => entry.name).join("  ");
  }
  function helpText() {
    return "pwd — show the current directory\nls [path] — list a directory\ncd [directory] — change directory\ncd .. — go to parent  |  cd - — return to previous\ncd ~ — go home  |  man ls — read the ls manual";
  }
  function execute(commandLine) {
    const tokens = tokenize(commandLine.trim());
    if (!tokens.length) return { result: "", quiet: true };
    const [command, ...args] = tokens;
    if (command === "pwd") return args.length ? { result: "pwd: too many arguments", error: true } : { result: state.currentDirectory, help: "pwd tells you the absolute path of your current working directory." };
    if (command === "ls") {
      let detailed = false, showHidden = false;
      const paths = [];
      for (const arg of args) {
        if (arg.startsWith("-") && arg.length > 1) {
          if ([...arg.slice(1)].some((flag) => !"la".includes(flag))) return { result: `ls: invalid option -- '${arg.slice(1)}'`, error: true };
          detailed ||= arg.includes("l"); showHidden ||= arg.includes("a");
        } else paths.push(arg);
      }
      if (paths.length > 1) return { result: "ls: this practice terminal accepts one path at a time", error: true };
      const target = paths.length ? resolveExistingPath(paths[0]) : state.currentDirectory;
      if (!nodeAt(target)) return { result: `ls: cannot access '${paths[0]}': No such file or directory`, error: true };
      if (!canList(target)) return { result: "ls: Permission denied", error: true };
      return { result: listDirectory(target, detailed, showHidden), help: args.length ? null : "ls shows the locations and files inside your current directory." };
    }
    if (command === "cd") {
      if (args.length > 1) return { result: "bash: cd: too many arguments", error: true };
      if (args.length === 0 || args[0] === "~") { navigate(homePath); return { result: "", help: "cd with no destination takes you back to your home directory." }; }
      if (args[0] === "-") {
        if (!state.previousDirectory || !pathIsAccessible(state.previousDirectory)) return { result: "bash: cd: OLDPWD not set", error: true };
        const destination = state.previousDirectory;
        navigate(destination);
        return { result: destination };
      }
      const target = resolveExistingPath(args[0]);
      const targetNode = nodeAt(target);
      if (targetNode?.type === "directory" && !pathIsAccessible(target)) return { result: "cd: Permission denied", error: true };
      if (!targetNode || targetNode.type !== "directory") return { result: `cd: ${args[0]}: No such file or directory`, error: true };
      navigate(target);
      return { result: "", help: args[0].startsWith("/") ? "An absolute path starts at /, so it works from any current location." : "A relative path is interpreted from the directory where you are now." };
    }
    if (command === "man") {
      if (args.length === 1 && args[0] === "ls") return { result: "LS(1) — list directory contents\n\nNAME\n    ls — list information about files\n\nOPTIONS\n    -l   use a long listing format\n    -a   include hidden entries\n    -la  combine both options\n\nIn this simulation, use ls, ls -l, ls -a, or ls -la.", help: "Manual pages are command documentation. Use man followed by a command name." };
      return { result: `No manual entry for ${args[0] || ""}`.trim(), error: true };
    }
    if (command === "clear") { output.replaceChildren(); return { result: "", quiet: true }; }
    if (command === "help") return { result: helpText() };
    return { result: `${command}: command not found`, error: true };
  }
  function submitCommand(raw) {
    const command = raw.trim();
    if (!command) return;
    const commandPath = state.currentDirectory;
    state.commandHistory.push(command);
    state.historyIndex = state.commandHistory.length;
    const response = execute(command);
    if (!response.quiet) appendOutput(command, response.result, response.error, commandPath);
    if (response.help && state.helpMode) appendHelp(response.help);
    input.value = "";
    input.focus();
  }
  function appendHelp(message) {
    const help = createElement("div", "inline-help");
    const icon = document.createElement("i"); icon.className = "fa-solid fa-circle-info"; icon.setAttribute("aria-hidden", "true");
    help.append(icon, createElement("span", "", message));
    output.append(help);
    output.scrollTop = output.scrollHeight;
  }

  function addDeviceNode(device) {
    const parent = parentPath(device.mountPoint);
    const parentNode = nodeAt(parent);
    if (!parentNode) return;
    const mountName = parts(device.mountPoint).at(-1);
    const existing = parentNode.children.findIndex((entry) => entry.name === mountName);
    const mountNode = directory(mountName, device.contents, { deviceType: device.deviceType, deviceId: device.id, description: `${device.name} · mounted storage` });
    if (existing >= 0) parentNode.children[existing] = mountNode;
    else parentNode.children.push(mountNode);
  }
  function removeDeviceNode(device) {
    const parentNode = nodeAt(parentPath(device.mountPoint));
    if (!parentNode) return;
    parentNode.children = parentNode.children.filter((entry) => entry.name !== parts(device.mountPoint).at(-1));
  }
  function connectDevice(id) {
    const device = state.externalDevices[id];
    device.connected = true; device.mounted = true;
    addDeviceNode(device);
    render();
    showToast(`${device.name} connected`, "success", `Device mounted at ${device.mountPoint}`);
    appendSystemMessage(`${device.name} Connected`, `Device mounted at: ${device.mountPoint}`);
  }
  function disconnectDevice(id) {
    const device = state.externalDevices[id];
    device.connected = false; device.mounted = false;
    removeDeviceNode(device);
    const insideMount = isInside(state.currentDirectory, device.mountPoint);
    if (insideMount) {
      state.previousDirectory = null;
      state.currentDirectory = homePath;
      render();
      showToast(`${device.name} disconnected`, "warning", `Your current location is no longer available. Returned to ${homePath}.`);
      appendSystemMessage(`${device.name} Disconnected`, `Your current location is no longer available. Returning to ${homePath}.`);
    } else {
      render();
      showToast(`${device.name} disconnected`, "info", "Its mount point is no longer available.");
      appendSystemMessage(`${device.name} Disconnected`, "The mount point is no longer available.");
    }
  }
  function appendSystemMessage(title, detail) {
    const entry = createElement("div", "device-terminal-message");
    entry.append(createElement("strong", "", title), createElement("span", "", detail));
    output.append(entry);
    output.scrollTop = output.scrollHeight;
  }
  function showToast(title, type = "info", detail = "") {
    const toast = createElement("div", `toast notification toast-${type}`);
    const icon = document.createElement("i");
    icon.className = `fa-solid ${type === "success" ? "fa-circle-check" : type === "warning" ? "fa-triangle-exclamation" : "fa-circle-info"}`;
    icon.setAttribute("aria-hidden", "true");
    const copy = createElement("span", "toast-copy"); copy.append(createElement("strong", "", title));
    if (detail) copy.append(createElement("small", "", detail));
    toast.append(icon, copy);
    $("#toastRegion").append(toast);
    window.setTimeout(() => toast.remove(), 5200);
  }
  function renderReference() {
    const visible = state.commandReferenceVisible;
    $("#commandReference").hidden = !visible;
    $("#referenceToggle").setAttribute("aria-expanded", String(visible));
    $("#referenceToggle").innerHTML = `<span class="icon"><i class="fa-solid ${visible ? "fa-eye-slash" : "fa-book-open"}" aria-hidden="true"></i></span><span>${visible ? "Hide" : "Show"} command reference</span>`;
  }
  function setTheme(theme) {
    state.theme = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("linux-apartment-theme", theme);
    const dark = theme === "dark";
    $("#themeToggle").setAttribute("aria-pressed", String(dark));
    $("#themeToggle").innerHTML = `<span class="icon"><i class="fa-solid ${dark ? "fa-sun" : "fa-moon"}" aria-hidden="true"></i></span><span>${dark ? "Light mode" : "Dark mode"}</span>`;
  }

  form.addEventListener("submit", (event) => { event.preventDefault(); submitCommand(input.value); });
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (state.commandHistory.length) { state.historyIndex = Math.max(0, state.historyIndex - 1); input.value = state.commandHistory[state.historyIndex]; }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      state.historyIndex = Math.min(state.commandHistory.length, state.historyIndex + 1);
      input.value = state.commandHistory[state.historyIndex] || "";
    }
  });
  $("#parentButton").addEventListener("click", () => navigate(parentPath(state.currentDirectory)));
  $("#clearTerminal").addEventListener("click", () => { output.replaceChildren(); input.focus(); });
  $("#themeToggle").addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));
  $("#referenceToggle").addEventListener("click", () => {
    state.commandReferenceVisible = !state.commandReferenceVisible;
    localStorage.setItem("linux-apartment-reference", state.commandReferenceVisible ? "visible" : "hidden");
    renderReference();
  });
  setTheme(state.theme === "dark" ? "dark" : "light");
  renderReference();
  render();
  appendHelp("Welcome home! Try pwd to see your location, or ls to look around.");
  input.focus();
})();

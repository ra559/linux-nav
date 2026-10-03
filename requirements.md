# Linux File System Apartment Complex
## Web Application Requirements Document

## 1. Project Overview

**Linux File System Apartment Complex** is an educational web application designed to help beginning Linux students understand the Linux file system through a visual apartment-complex metaphor.

The application represents a simplified Linux file system as an apartment complex. Students interact with the simulated system through a terminal-like interface and use fundamental Linux commands to navigate the hierarchy.

The initial version focuses on:

- `pwd`
- `ls`
- `cd`

The application also introduces:

- Linux paths
- Relative and absolute paths
- Home directories
- Users
- Permissions
- Mounted storage
- External devices
- Basic Linux documentation
- Terminal navigation

The application is intended for use in an introductory Linux Fundamentals course.

---

# 2. Educational Objectives

After using the application, students should be able to:

1. Explain that the Linux file system is hierarchical.
2. Identify the root directory `/`.
3. Understand the relationship between `/home` and individual user directories.
4. Understand that each user has a home directory.
5. Explain the concept of a current working directory.
6. Explain what `pwd` does.
7. Explain what `ls` does.
8. Explain what `cd` does.
9. Navigate using relative paths.
10. Navigate using absolute paths.
11. Navigate to a parent directory with `cd ..`.
12. Switch between previous and current directories using `cd -`.
13. Understand basic Linux permissions.
14. Understand the distinction between physical storage devices and their mount points.
15. Use the application's command reference to learn command syntax.
16. Use `man` pages as a source of Linux command documentation.
17. Experiment with additional Bash commands using an external browser-based shell.

---

# 3. Core Apartment-Complex Metaphor

The application uses an apartment complex as the primary teaching metaphor.

| Linux Concept | Apartment Complex Representation |
|---|---|
| File system | Entire apartment complex |
| `/` | Entire property/building |
| Directory | Physical location |
| `/home` | Residential area |
| User | Resident |
| User's home directory | Resident's apartment |
| File | Object/document inside a location |
| Subdirectory | Room or smaller location |
| Parent directory | Larger location containing the current location |
| Current working directory | Where the student currently is |
| `pwd` | Asking "Where am I?" |
| `ls` | Looking around to see what is here |
| `cd` | Walking to another location |
| Permissions | Whether the resident can enter or modify an area |
| Root user | Building administrator/superuser |
| External device | Storage container brought into the complex |
| Mount point | Location assigned to that storage device |

The metaphor should remain consistent throughout the application.

---

# 4. Technology Requirements

The application must use:

- HTML5
- CSS3
- Vanilla JavaScript
- Bulma CSS
- A supported icon toolkit

No backend is required.

No JavaScript framework is required.

No build system is required.

The application must be capable of running as a static web application.

---

# 5. Project Structure

The final application must consist of exactly three primary project files:

```text
linux-apartment-complex/
├── index.html
├── app.js
└── styles.css
```

### `index.html`

Contains the application's HTML structure and loads:

- `styles.css`
- `app.js`
- Bulma CSS
- The selected icon resources

### `app.js`

Contains all application behavior, including:

- File-system data
- Navigation
- Commands
- Users
- Permissions
- Terminal history
- External devices
- Mount points
- Notifications
- Theme switching
- Command-reference visibility
- Character movement

### `styles.css`

Contains custom application-specific styling, including:

- Apartment-complex visualization
- Character visualization
- Directory and file appearance
- Theme customization
- Device visualization
- Terminal customization
- Animations
- Layout adjustments not provided by Bulma

---

# 6. Bulma CSS

The application must use **Bulma CSS** as its primary UI toolkit.

Bulma must be loaded through a CDN from `index.html`.

Example:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bulma@latest/css/bulma.min.css"
>
```

Bulma should provide common interface components such as:

- Buttons
- Cards
- Notifications
- Panels
- Forms
- Input fields
- Containers
- Columns
- Tags
- Layout
- Responsive behavior

Custom `styles.css` should handle the Linux-specific visual metaphor rather than recreating standard Bulma components.

---

# 7. Icon Toolkit

The application should use a dedicated icon library for visual elements.

### Primary Icon Source

Flaticon should be the preferred icon source where suitable icons are available and their applicable licensing permits the intended educational use.

Icons may represent:

- Open folders
- Closed folders
- Files
- Home directories
- Apartments
- Users
- The student's character
- USB drives
- CDs
- Floppy disks
- Network storage
- Computers
- Navigation controls

### Fallback

If a suitable Flaticon resource is unavailable or its licensing does not permit the intended use, use an open-source icon toolkit.

Preferred alternatives include:

- Font Awesome Free
- Material Symbols
- Bootstrap Icons
- Tabler Icons
- Lucide

Icon resources should be loaded through a CDN.

The icon library must not require a package manager or build system.

---

# 8. Application Layout

The interface should have three primary areas:

```text
+-------------------------------------------------------+
|              Linux Apartment Complex                 |
+-------------------------------------------------------+
|                                                       |
|              VISUAL FILE SYSTEM                      |
|                                                       |
|      +-------------+     +-------------+              |
|      | /home       |     | /etc        |              |
|      |             |     |             |              |
|      +-------------+     +-------------+              |
|             |                                         |
|      +-------------+     +-------------+              |
|      | student     |     | bobby       |              |
|      | Apartment   |     | Apartment   |              |
|      +-------------+     +-------------+              |
|                                                       |
+-------------------------------------------------------+
| Current Location: /home/student                       |
+-------------------------------------------------------+
| Terminal                                              |
| student@linux:~$                                     |
| >                                                     |
+-------------------------------------------------------+
```

The final layout may differ visually but must preserve the distinction between:

1. Visual file system
2. Current location
3. Terminal

Additional controls and reference panels should integrate without obscuring these primary areas.

---

# 9. Simulated File System

The file system must be represented as JavaScript data rather than hard-coded into the visual interface.

Example:

```javascript
const fileSystem = {
    name: "/",
    type: "directory",
    children: [
        {
            name: "home",
            type: "directory",
            children: [
                {
                    name: "student",
                    type: "directory",
                    owner: "student",
                    children: []
                }
            ]
        }
    ]
};
```

This architecture must allow additional directories, files, users, permissions, and devices to be added without rewriting the visual interface.

---

# 10. Initial File System

The initial simulated file system should contain a structure similar to:

```text
/
├── bin
├── etc
├── home
│   ├── student
│   │   ├── Desktop
│   │   ├── Documents
│   │   ├── Downloads
│   │   └── Pictures
│   └── bobby
│       ├── Desktop
│       ├── Documents
│       └── Downloads
├── media
├── mnt
├── tmp
├── usr
│   ├── bin
│   └── share
└── var
    ├── log
    └── www
```

The exact contents should remain configurable.

---

# 11. Users and Home Directories

The application should support multiple simulated users.

Example:

```text
/home
├── student
└── bobby
```

The currently logged-in student should start inside their own home directory:

```text
/home/student
```

The user's apartment should be visually distinct from other apartments.

---

# 12. Current Working Directory

The application must maintain the student's current working directory.

Examples:

```text
/
```

```text
/home
```

```text
/home/student
```

```text
/home/student/Documents
```

The current location must be visually highlighted.

Whenever `cd` succeeds, both the graphical location and terminal state must update.

---

# 13. `pwd`

The application must implement:

```bash
pwd
```

It must return the absolute path of the current working directory.

Example:

```text
student@linux:~$ pwd
/home/student
```

After navigating to Documents:

```text
student@linux:~/Documents$ pwd
/home/student/Documents
```

The visual representation must correspond to the returned path.

---

# 14. `ls`

The application must implement:

```bash
ls
```

It should list the contents of the current directory.

Example:

```text
student@linux:~$ ls
Desktop  Documents  Downloads  Pictures
```

The visual file-system representation must correspond to the same directory contents.

---

# 15. `ls` Options

The command reference must explain that `ls` supports options.

Examples:

```bash
ls -l
ls -a
ls -la
```

The application does not need to implement every `ls` option in Version 1.

Students should be taught that command options can be discovered through the command's manual page:

```bash
man ls
```

The goal is to establish the principle that Linux commands have built-in documentation and that students can use manual pages to discover additional functionality.

---

# 16. `cd`

The application must implement:

```bash
cd <directory>
```

Example:

```bash
cd Documents
```

The application must:

1. Validate the destination.
2. Change the current directory.
3. Update the terminal prompt.
4. Update the graphical location.
5. Move the character representation accordingly.

---

# 17. Relative Paths

The application must support relative paths.

Example:

```bash
cd Documents
```

If the current location is:

```text
/home/student
```

the resulting location is:

```text
/home/student/Documents
```

The command reference should explain that relative paths are interpreted from the current working directory.

---

# 18. Absolute Paths

The application must support absolute paths.

Example:

```bash
cd /home/student/Documents
```

Absolute paths begin at `/` and do not depend on the student's current directory.

The application should visually and textually distinguish absolute and relative paths.

---

# 19. `cd ..`

The application must support:

```bash
cd ..
```

This moves the student to the parent directory.

Example:

```text
/home/student/Documents
        |
        | cd ..
        ↓
/home/student
```

The character should visually move toward the parent location.

---

# 20. `cd ~`

The application should support:

```bash
cd ~
```

This returns the student to their home directory.

---

# 21. `cd` Without Arguments

The application should support:

```bash
cd
```

with no argument.

This should also return the student to their home directory.

---

# 22. `cd -`

The application must support:

```bash
cd -
```

This switches between the current working directory and the previous working directory.

Example:

```text
$ pwd
/home/student

$ cd Documents

$ pwd
/home/student/Documents

$ cd -

$ pwd
/home/student
```

The application must maintain the previous working directory as state.

The command reference must clearly distinguish:

```text
cd ..
    Move to the parent directory.

cd -
    Switch to the previous working directory.
```

These commands must not be treated as equivalent.

---

# 23. Permissions

The application should demonstrate basic Linux permission concepts.

A student should have broad access within their own home directory.

Outside their home directory, some locations should be restricted.

For example:

```text
cd /restricted
```

may return:

```text
cd: Permission denied
```

Version 1 only needs to simulate permissions relevant to navigation.

Full Linux permission semantics are outside the scope of the initial version.

---

# 24. Terminal Interface

The application must contain a terminal-like interface.

Example:

```text
student@linux:~/Documents$ cd ..
student@linux:~$
```

The terminal should support command history through:

```text
Arrow Up
Arrow Down
```

The terminal must remain keyboard accessible.

---

# 25. Terminal Prompt

The prompt must reflect the current location.

For example:

```text
student@linux:~$
```

for:

```text
/home/student
```

and:

```text
student@linux:~/Documents$
```

for:

```text
/home/student/Documents
```

---

# 26. Command Validation and Errors

Invalid commands must not crash the application.

Unknown commands should produce Linux-like output:

```text
foo: command not found
```

Invalid directories should produce:

```text
cd: Banana: No such file or directory
```

Permission violations should produce:

```text
cd: Permission denied
```

The error messages do not need to reproduce every Bash implementation detail.

---

# 27. Graphical Navigation

The graphical file system and terminal must remain synchronized.

Executing:

```bash
cd Documents
```

must move the graphical character into the Documents location.

The character's visual state should change as it moves through the apartment complex.

Graphical navigation may optionally display the equivalent Linux command.

---

# 28. Directory Visualization

Directories should be represented as physical locations.

For example:

```text
Student Apartment
├── Bedroom
├── Kitchen
├── Documents
└── Downloads
```

Each directory should provide:

- Name
- Path
- Icon
- Contents
- Access state

Directories and files must be visually distinguishable.

---

# 29. Files

Files should be represented as objects contained within directories rather than locations that can be entered.

Example:

```text
Documents/
├── linux_notes.txt
└── lab_report.md
```

---

# 30. External Devices

The interface must contain an **External Devices** section.

It must provide controls for:

- USB Flash Drive
- CD
- Network Attached Storage
- Floppy Disk

Example:

```text
+--------------------------------------+
| External Devices                     |
|                                      |
| [ Connect USB Flash Drive ]          |
| [ Insert CD ]                        |
| [ Connect Network Storage ]           |
| [ Insert Floppy Disk ]               |
+--------------------------------------+
```

---

# 31. Device Connection

Clicking a device button simulates physically connecting or inserting the device.

A notification must appear.

Example:

```text
USB Flash Drive Connected

Device mounted at:
/media/student/USB
```

The device must then become available within the simulated Linux file system.

---

# 32. External Device Mount Points

Each device must have a simulated mount point.

| Device | Mount Point |
|---|---|
| USB Flash Drive | `/media/student/USB` |
| CD | `/media/student/CD` |
| Network Attached Storage | `/mnt/nas` |
| Floppy Disk | `/media/student/floppy` |

The mount points must be part of the JavaScript file-system model.

---

# 33. Device Contents

Each device should have predefined simulated contents.

Example USB drive:

```text
USB/
├── assignments/
├── linux_notes.txt
└── backup/
```

Example CD:

```text
CD/
├── documentation/
├── installer/
└── README.txt
```

Example NAS:

```text
NAS/
├── shared/
├── public/
└── backups/
```

Example floppy:

```text
floppy/
├── README.txt
├── old_files/
└── assignment.txt
```

---

# 34. Device Navigation

Students must navigate to external devices using the same Linux commands used elsewhere.

For example:

```bash
ls /media/student
```

could return:

```text
USB
```

Then:

```bash
cd /media/student/USB
```

moves the student into the flash drive.

`pwd` should return:

```text
/media/student/USB
```

The graphical interface must represent the character entering the external device.

---

# 35. Device State

Each external device should maintain state similar to:

```javascript
{
    name: "USB",
    type: "external-device",
    deviceType: "flash-drive",
    connected: false,
    mounted: false,
    mountPoint: "/media/student/USB"
}
```

When connected:

```text
connected: true
mounted: true
```

The visual interface must update automatically.

---

# 36. Device Disconnection

The architecture should support disconnecting external devices.

If a device is disconnected while the student is inside its mounted location, the application must prevent the student from remaining in an invalid location.

For example:

```text
USB Flash Drive disconnected.

Your current location is no longer available.
Returning to /home/student.
```

---

# 37. Educational Mounting Concept

The application should introduce mounting conceptually:

```text
Physical Device
       ↓
Connected to Computer
       ↓
Mounted by Linux
       ↓
Assigned a Mount Point
       ↓
Accessible through File System
       ↓
Navigated with Linux Commands
```

The apartment metaphor should represent the physical device as a storage container that has been brought into the complex, while the mount point represents the location where that container can be accessed.

---

# 38. Light and Dark Mode

The application must provide a **manual light/dark mode toggle**.

The application must not automatically switch themes based on:

- Operating-system preference
- Browser preference
- Time of day
- Ambient light
- Any other automatic mechanism

The user must explicitly select the theme.

Example:

```text
[ Light ] [ Dark ]
```

or:

```text
Theme: Light / Dark
```

Both themes must apply to:

- Bulma UI
- Apartment complex
- Terminal
- External devices
- Notifications
- Icons
- Character visualization

The theme can be persisted using `localStorage`.

The saved user choice must never be overridden by automatic system-theme detection.

---

# 39. Command Reference Panel

The application must contain a clearly visible **Linux Commands** reference panel.

The panel must explain:

- `pwd`
- `ls`
- `ls` options
- `man ls`
- `cd`
- Relative paths
- Absolute paths
- `cd ..`
- `cd -`

Example:

```text
LINUX COMMANDS

pwd
Print your current working directory.

ls
List the contents of the current directory.

Options:
ls -l
ls -a
ls -la

Use:
man ls

to learn more about available options.

cd
Change your current directory.

Relative:
cd Documents

Absolute:
cd /home/student/Documents

Parent:
cd ..

Previous:
cd -
```

The panel should use Bulma components and application-specific styling from `styles.css`.

---

# 40. Toggleable Command Reference

The Linux Commands panel must be toggleable.

The user must be able to hide and show it at will.

Example:

```text
[ Show Command Reference ]
```

When visible:

```text
[ Hide Command Reference ]
```

Hiding the panel must not:

- Change the current directory.
- Clear the terminal.
- Clear command history.
- Disconnect devices.
- Change the theme.
- Reset the file system.
- Interrupt a challenge.

The panel's visibility state may be persisted using `localStorage`.

When hidden, the main apartment-complex visualization should be able to use the additional available interface space.

---

# 41. External Bash Practice Resource

At the bottom of the Linux Commands reference panel, the application must provide a link to a free browser-based Bash/Linux shell.

The purpose is to give students a place to experiment with commands beyond the limited command set implemented by the application.

The resource should be clearly labeled, for example:

```text
PRACTICE MORE LINUX

Want to experiment with additional Linux commands?

Try a real Bash shell in your browser.

[ Open Free Bash Shell ]
```

The external shell must remain separate from the application's simulated file system.

Commands executed in the external shell must not modify the application's internal file-system model.

The link should open in a new browser tab.

The selected service must be free to use and suitable for educational experimentation. Webminal is an example of an appropriate browser-based Bash/Linux environment.

---

# 42. Educational Mode

The application should provide an optional educational/help mode.

Examples:

```text
COMMAND: pwd

pwd means "print working directory."

It tells you where you currently are
in the Linux file system.
```

and:

```text
COMMAND: ls

ls lists files and directories
located in your current directory.
```

The instructor should eventually be able to disable this assistance for assessment activities.

---

# 43. Challenge Mode

A future version should support navigation challenges.

Example:

```text
Challenge:

You are currently in:

/home/student

Navigate to Documents.
```

The student must execute:

```bash
cd Documents
```

The application detects the correct destination and records the successful completion.

Additional challenges can require:

- Finding a directory.
- Returning home.
- Navigating with an absolute path.
- Navigating with a relative path.
- Using `cd ..`.
- Using `cd -`.
- Finding an external storage device.

---

# 44. Assessment Support

Future versions should support instructor-created tasks.

Example:

```text
Task 1:
Use pwd to determine your current location.

Task 2:
Use ls to inspect your apartment.

Task 3:
Navigate to Documents.

Task 4:
Return to your home directory.

Task 5:
Find the connected USB drive.
```

The application should eventually record whether each task was completed successfully.

---

# 45. State Management

The application must maintain at least:

```javascript
currentUser
currentDirectory
previousDirectory
fileSystem
commandHistory
historyIndex
externalDevices
theme
commandReferenceVisible
```

The architecture must keep the simulated file system separate from the DOM so that the interface can be regenerated from application state.

---

# 46. Accessibility

The application must:

- Use semantic HTML.
- Support keyboard interaction.
- Maintain visible focus indicators.
- Provide sufficient contrast.
- Avoid relying exclusively on color.
- Provide accessible labels for controls.
- Keep the terminal keyboard accessible.
- Provide accessible labels for icon-only controls where applicable.
- Make the light/dark toggle keyboard accessible.
- Make the command-reference toggle keyboard accessible.

---

# 47. Responsive Design

The application should work on:

- Desktop computers
- Laptops
- Tablets

On smaller displays, the interface may stack:

```text
File System
     ↓
Current Location
     ↓
Terminal
     ↓
Controls / Reference
```

The graphical file system should remain usable without requiring excessive horizontal scrolling.

---

# 48. Instructor Configuration

The architecture should eventually allow instructors to configure:

- Student username
- Home directory
- Users
- Directories
- Files
- Permissions
- Starting location
- External-device contents
- Challenges
- Help mode
- Graphical navigation
- Command-reference visibility

For Version 1, these values may be defined in JavaScript configuration objects.

---

# 49. Persistence

The application does not require a backend or database.

`localStorage` may be used for user preferences such as:

- Light/dark theme
- Command-reference visibility

Persistent student progress is optional and should not be required for Version 1.

---

# 50. Error Handling

Invalid input must never crash the application.

Examples:

```bash
foo
```

Output:

```text
foo: command not found
```

```bash
cd Banana
```

Output:

```text
cd: Banana: No such file or directory
```

```bash
cd /restricted
```

Output:

```text
cd: Permission denied
```

---

# 51. Version 1 Command Scope

Version 1 must implement:

```text
pwd
ls
cd
```

including:

```text
cd DIRECTORY
cd ..
cd -
cd /
cd /absolute/path
cd ~
cd
```

Version 1 should introduce:

- Root directory
- Home directories
- Users
- Directories
- Files
- Current working directory
- Relative paths
- Absolute paths
- Parent directories
- Previous-directory navigation
- Basic permissions
- External storage
- Mount points

The following commands are outside Version 1:

```text
cp
mv
rm
mkdir
touch
cat
chmod
chown
sudo
grep
find
```

These can be introduced in future versions.

---

# 52. Future Expansion

The application architecture should support a progressive expansion of Linux concepts.

### Version 1 — Navigation

```text
pwd
ls
cd
```

### Version 2 — Files

```text
touch
cat
```

### Version 3 — File Management

```text
cp
mv
rm
```

### Version 4 — Directories

```text
mkdir
rmdir
```

### Version 5 — Permissions

```text
chmod
chown
sudo
```

### Version 6 — Processes

```text
ps
top
kill
```

The apartment metaphor should continue into these features.

For example:

```text
mkdir
```

could represent creating a new room, while:

```text
mv
```

could represent moving an object from one apartment to another.

---

# 53. Definition of Done

Version 1 is complete when:

- The application consists of `index.html`, `app.js`, and `styles.css`.
- The application loads as a static web application.
- Bulma is loaded through a CDN.
- An appropriate icon toolkit is loaded through a CDN.
- The root directory is visually represented.
- `/home` contains multiple users.
- The student has a home directory.
- The current location is visually identified.
- `pwd` works.
- `ls` works.
- `cd` works.
- Relative paths work.
- Absolute paths work.
- `cd ..` works.
- `cd -` works.
- `cd ~` works.
- `cd` without arguments returns home.
- The terminal prompt reflects the current location.
- Invalid commands generate appropriate errors.
- Invalid directories generate appropriate errors.
- Basic permissions can be demonstrated.
- USB flash drives can be connected.
- CDs can be connected/inserted.
- NAS can be connected.
- Floppy disks can be connected/inserted.
- External devices have simulated mount points.
- Connected devices appear in the visual file system.
- Students can navigate to mounted devices.
- Connection notifications appear.
- The graphical file system and terminal remain synchronized.
- The character visually represents movement through the file system.
- Light and dark themes can be manually selected.
- Themes do not automatically change.
- The Linux Commands reference panel exists.
- The reference panel can be shown and hidden.
- The reference panel explains `pwd`, `ls`, and `cd`.
- The reference explains `ls` options and `man ls`.
- The reference explains relative and absolute paths.
- The reference explains `cd ..` and `cd -`.
- The reference contains a link to an external browser-based Bash environment.
- The external shell is independent of the simulated file system.
- The application is keyboard accessible.
- The application is responsive.
- The underlying file-system model is stored as JavaScript data rather than hard-coded into the visual interface.
- The architecture allows additional Linux commands and educational challenges to be added later.
<h1 align="center">Tomoe</h1>

<div align="center">
  A wrapper for bancho.py that emulates osu!api v1 and v2
</div>

<br />

## Table of Contents
- [What is this project about?](#about)
- [Tested discord bots](#tested-discord-bots)
- [Requeriments](#requeriments)
- [Installation](#installation)
- [Handled routes](#handled-routes)

### About
Wrapper that its main use is to make discord bots that make use of the osu!api v1 or v2 compatible with bancho.py

### Tested discord bots
See [compatibility](SV_COMPATIBILITY.MD).

### Requeriments
- Node.js v16 or higher (Tested on v19.0.0)
- Yarn (Tested on v1.22.19)
- A working instance of bancho.py
- Access to the bancho.py api and its database

### Usage
- TODO

### Handled routes:
```
- osu!api v1
    /get_beatmaps      : Pending
    /get_scores        : Done
    /get_user          : Done (Without user level and events)
    /get_user_best     : Done
    /get_user_recent   : Done
    /get_match         : Not supported on bancho.py
    /get_replay        : Done (Partially)

- osu!api v2
    (Not yet implemented)
```
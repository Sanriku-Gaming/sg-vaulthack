# SG Vaulthack
A configurable vault hacking minigame for FiveM servers.

## Features
- Customizable difficulty levels
- Dynamic target generation
- Responsive UI with visual and audio feedback
- Configurable game parameters (targets, speed, size, time, etc.)
- Debug mode for testing and development

## Requirements
- None. This is a fully standalone nui minigame.

## Installation
1. Download the latest version of sg-vaulthack from github.
2. Place `sg-vaulthack` in your `[standalone]` or `[sg]` folder.
3. Add `ensure sg-vaulthack` to your server.cfg unless placed in an ensured folder.
4. Configure the game parameters in `config.js` as desired, or create new ones by adding to the list.
5. Restart your server.

## Usage

To start the minigame, use the following export in your script:

```lua
local success = exports['sg-vaulthack']:StartHack(options)
```

The `options` table can include the following parameters:
- `difficulty`: A string specifying the difficulty level ("easy", "medium", "hard", "ultra", or "testing")
- `targets`: Number of targets to hit (overrides the default for the chosen difficulty)
- `speed`: Speed of the needle (overrides the default for the chosen difficulty).
- `totalTime`: Total time allowed for the hack in seconds (overrides the default for the chosen difficulty)
- `lossTime`: Time penalty for misses in seconds (overrides the default for the chosen difficulty)

The function returns `true` if the hack was successful, and `false` if it failed.

Examples:
```lua
local success = exports['sg-vaulthack']:StartHack({
    difficulty = 'medium',
    targets = 4,
    speed = 3,
    totalTime = 40,
    lossTime = 2,
})

if success then
    print("Hack successful!")
else
    print("Hack failed!")
end
```
Or you can simply pass the difficulty and use the pre-defined settings in the config.js.

```lua
local success = exports['sg-vaulthack']:StartHack({
    difficulty = 'ultra',
})

if success then
    print("Hack successful!")
else
    print("Hack failed!")
end
```

### Debug Mode
To enable debug mode for testing:
1. Set `debug = true;` in `config.js`
2. Press 's' key in the browser to start the game in testing mode

## Customization
You can customize the game parameters by modifying the `config.js` file. Available options include:
- Number of targets
- Needle speed
- Target size range
- Total game time
- Time penalty for misses
- Localization strings

## Preview
![vaulthack video example](./assets/sg-vaulthack-demo.webm)

## Credits
- Created by: [Nicky](https://forum.cfx.re/u/Sanriku)
- [SG Scripts Discord](https://discord.gg/uEDNgAwhey)
- [Tebex](https://sanriku-gaming.tebex.io/)
# Shared Vision Documentation

## Introduction
Welcome to the Shared Vision documentation.

Shared Vision is a module that provides an easy way to share vision between multiple tokens.<br>
By default, you can do this in Foundry by giving every player observer permissions, but in that case tokens will only share vision if the player has no tokens selected.<br>
Shared Vision allows you to configure actors so they will always share their vision, or only when you press a control button, or when it's triggered by [Trigger Happy](https://foundryvtt.com/packages/trigger-happy/) or [Hey, Wait!](https://foundryvtt.com/packages/hey-wait/)

Besides sharing the vision of all players tokens with all players, there are some player-specific options.<br>
An actor can be configured to always share its vision with specific players, it can also be configured to share its location with specific players (the token icon will be drawn over unexplored areas), or share its fog exploration with specific players.

A control button allows you to easily toggle vision sharing for all players for specified actors (Global Shared Vision). The reasoning behind this is that, when dungeon delving, the player in the back of the marching order will miss out on all the awesome stuff that's happening at the front. The GM might have prepared an awesome cut-scene, with vivid descriptions, but the wizard at the back isn't in the same room yet as the fighter in the front, so the wizard's player is missing out on all the action!<br>
Shared Vision allows the GM to press a button, and the vision between specified tokens will be shared with all players, so everyone gets to enjoy the cool stuff at the front.

## Getting Started
Tokens can share one or more of the different [sharing options](sharingOptions.md).

You can either configure the sharing options on an actor-by-actor basis in the [vision config](visionConfig.md), or configure the sharing options based on token ownership or disposition in the [module settings](moduleSettings.md).

In the [module settings](moduleSettings.md) you can also configure whether some sharing options should be enabled or disabled when combat starts or stops.

There are [control buttons](controlButtons.md) that can be used to enable or disable some sharing options.

Lastly, some Shared Vision settings can be enabled or disabled from [other modules or hooks](otherModules.md).

## Compatibility
<b>Foundry VTT:</b> v9 - v12<br>

<b>Module Combatibilities:</b><br>
Shared Vision overrides the default 'Token.prototype._isVisionSource' method while vision sharing is enabled. This could cause conflicts with other modules.<br>
For this reason, the [libWrapper](https://foundryvtt.com/packages/lib-wrapper/) library is used.

[Midi-OL](https://foundryvtt.com/packages/midi-qol/) has a 'Players control owned hidden tokens' setting that could cause issues. By default it should work fine, but if you have libWrapper installed and Midi QOL is set to a higher priority than Shared Vision, Shared Vision will no longer work.

The [Isometrics](https://foundryvtt.com/packages/grape_juice-isometrics) and [Levels](https://foundryvtt.com/packages/levels) modules are currently not compatible.

## Feedback
If you have any suggestions or bugs to report, feel free to submit an <a href="https://github.com/MaterialFoundry/SharedVision/issues">issue</a>, contact me on Discord (Cris#6864), or send me an email: info@materialfoundry.nl.

## Credits
<b>Author:</b> Cristian Deenen (Cris#6864 on Discord)<br>

Special thanks to Calego#0914, Cole#9640 and @muhahahahe for helping me out!
<br>
If you enjoy using my modules, please consider supporting me on <a href="https://www.patreon.com/materialfoundry">Patreon</a>.

## Abandonment
Abandoned modules are a (potential) problem for Foundry, because users and/or other modules might rely on abandoned modules, which might break in future Foundry updates.<br>
I consider this module abandoned if all of the below cases apply:

* This module/github page has not received any updates in at least 3 months
* I have not posted anything on "the Foundry" and "the League of Extraordinary Foundry VTT Developers" Discord servers in at least 3 months
* I have not responded to emails or PMs on Discord in at least 1 month
* I have not announced a temporary break from development, unless the announced end date of this break has been passed by at least 3 months

If the above cases apply (as judged by the "League of Extraordinary Foundry VTT Developers" admins), I give permission to the "League of Extraordinary Foundry VTT Developers" admins to assign one or more developers to take over this module, including requesting the Foundry team to reassign the module to the new developer(s).

I require the "League of Extraordinary Foundry VTT Developers" admins to send me an email 2 weeks before the reassignment takes place, to give me one last chance to prevent the reassignment.

I and all other contributors must be credited in all future releases.

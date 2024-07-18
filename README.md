<h1>Shared Vision</h1>
Shared Vision is a module that provides an easy way to share vision between multiple tokens.<br>
By default, you can do this in Foundry by giving every player observer permissions, but in that case tokens will only share vision if the player has no tokens selected.<br>
Shared Vision allows you to configure actors so they will always share their vision, or only when you press a control button, or when it's triggered by <a href="https://foundryvtt.com/packages/trigger-happy/">Trigger Happy</a> or <a href="https://foundryvtt.com/packages/hey-wait/">Hey, Wait!</a><br>
<br>
Besides sharing the vision of all players tokens with all players, there are some player-specific options.<br>
An actor can be configured to always share its vision with specific players, it can also be configured to share its location with specific players (the token icon will be drawn over unexplored areas), or share its fog exploration with specific players.<br>
<br>
A control button allows you to easily toggle vision sharing for all players for specified actors (Global Shared Vision). The reasoning behind this is that, when dungeon delving, the player in the back of the marching order will miss out on all the awesome stuff that's happening at the front. The GM might have prepared an awesome cut-scene, with vivid descriptions, but the wizard at the back isn't in the same room yet as the fighter in the front, so the wizard's player is missing out on all the action!<br>
Shared Vision allows the GM to press a button, and the vision between specified tokens will be shared with all players, so everyone gets to enjoy the cool stuff at the front.<br>  

<h1><a href="https://materialfoundry.github.io/SharedVision/">Documentation</a></h1>

<h1>Module Compatibility</h1>
Shared Vision overrides the default 'Token.prototype._isVisionSource' method while vision sharing is enabled. This could cause conflicts with other modules.<br>
For this reason, <a href="https://foundryvtt.com/packages/lib-wrapper/">libWrapper</a> was implemented.<br>
<br>
<a href="https://foundryvtt.com/packages/midi-qol/">Midi QOL</a> has the 'Players control owned hidden tokens' setting that could cause issues. By default it should work fine, but if you have libWrapper installed and Midi QOL is set to a higher priority than Shared Vision, Shared Vision will no longer work.<br>
<br>
Grape-Juice's Isometric module and Levels are currently not compatible<br>

<h1>Feedback</h1>
If you have any suggestions or bugs to report, feel free to submit an <a href="https://github.com/CDeenen/SharedVision/issues">issue</a>, contact me on Discord (Cris#6864), or send me an email: cdeenen@outlook.com.

<h1>Credits</h1>
<b>Author:</b> Cristian Deenen (Cris#6864 on Discord)<br>

Special thanks to Calego#0914 and Cole#9640 for helping me out!
<br>
If you enjoy using my modules, please consider supporting me on <a href="https://www.patreon.com/materialfoundry">Patreon</a>.

## Abandonment
Abandoned modules are a (potential) problem for Foundry, because users and/or other modules might rely on abandoned modules, which might break in future Foundry updates.<br>
I consider this module abandoned if all of the below cases apply:
<ul>
  <li>This module/github page has not received any updates in at least 3 months</li>
  <li>I have not posted anything on "the Foundry" and "the League of Extraordinary Foundry VTT Developers" Discord servers in at least 3 months</li>
  <li>I have not responded to emails or PMs on Discord in at least 1 month</li>
  <li>I have not announced a temporary break from development, unless the announced end date of this break has been passed by at least 3 months</li>
</ul>
If the above cases apply (as judged by the "League of Extraordinary Foundry VTT Developers" admins), I give permission to the "League of Extraordinary Foundry VTT Developers" admins to assign one or more developers to take over this module, including requesting the Foundry team to reassign the module to the new developer(s).<br>
I require the "League of Extraordinary Foundry VTT Developers" admins to send me an email 2 weeks before the reassignment takes place, to give me one last chance to prevent the reassignment.<br>
I require to be credited for my work in all future releases.

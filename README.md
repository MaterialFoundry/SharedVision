<h1>Shared Vision</h1>
Shared Vision is a <a href="https://foundryvtt.com/">Foundry VTT</a> module that provides an easy way to share vision between multiple tokens.<br>
By default, you can do this in Foundry by giving every player observer permissions, but in that case tokens will only share vision if the player has no tokens selected.<br>
Shared Vision allows you to configure actors so they will always share their vision, or only when you press a control button, or when it's triggered by <a href="https://foundryvtt.com/packages/trigger-happy/">Trigger Happy</a> or <a href="https://foundryvtt.com/packages/hey-wait/">Hey, Wait!</a><br>
<br>
Besides sharing the vision of all players tokens with all players, you could specify with what player the actor should share its vision. This could be useful if a player controls multiple tokens, such as familiars.<br>
<br>
A control button allows you to easily toggle vision sharing for all players for specified actors (Global Shared Vision). The reasoning behind this is that, when dungeon delving, the player in the back of the marching order will miss out on all the awesome stuff that's happening at the front. The GM might have prepared an awesome cut-scene, with vivid descriptions, but the wizard at the back isn't in the same room yet as the fighter in the front, so the wizard's player is missing out on all the action!<br>
Shared Vision allows the GM to press a button, and the vision between specified tokens will be shared with all players, so everyone gets to enjoy the cool stuff at the front.<br>

<h1>Instructions</h1>

<h2>Module Settings</h2>
You can access the module settings by pressing 'Game Settings' on the sidebar, clicking 'Module Settings' and searching for the 'Shared Vision' section.<br>
At the top you'll find a help button that will open a screen with the same instructions as this readme file.<br>
<br>
Besides the help button, you can enable always-on (also if you've not selected the token or if the token is invisible) vision sharing for each actor permission level. 
Simply check the box for the permission level you want.<br>
For example, if you always want to share vision with all tokens with permission level 'Observer', just check the box next to 'Actor Permission: Observer'.

![moduleSettings](https://github.com/CDeenen/SharedVision/blob/master/img/examples/ModuleSettings.png)

<h2>Actor Configuration</h2>
To configure which tokens should share their vision, you must go to the 'Permission Configuration' for the actor of that token.<br>
You can find this screen by selecting the 'Actors Directory' in the sidebar, right-clicking the actor, and pressing 'Configure Permissions'.
The 'Permission Configuration' screen will now open, and there will be some new options.<br>
<br>
The 'Global Shared Vision' checkbox determines if this actor should share its vision if the 'Global Shared Vision' control button is enabled.<br>
Below that you'll find a checkbox next to each (non GM) user's name, checking these boxes will always share that actors vision with the specific users, 
regardless of whether 'Global Shared Vision' is enabled.<br>
<br>
Ticking the 'Share Hidden' checkbox will result in the actor sharing its vision even if the actor's tokens are hidden/invisible.<br>
You could, for example, add invisible tokens to a spot where you want everyone to be able to see.<br>
<br>
Players do not need to have any permissions in order for the tokens to share their view. This will work if the token is an NPC.<br>

![permissionConfiguration](https://github.com/CDeenen/SharedVision/blob/master/img/examples/PermissionConfiguration.png)

<h2>Control Button</h2>
You can enable or disable 'Global Shared Vision' using a control button in the 'Basic Controls'. This only shares the vision for actors where you've checked 'Global Shared Vision' in the actor's 'Permission Configuration' screen.<br>
The control button has an eye icon, and is toggleable.
        
![controlButtons](https://github.com/CDeenen/SharedVision/blob/master/img/examples/ControlButtons.png)

<h2>Trigger Happy</h2>
<a href="https://foundryvtt.com/packages/trigger-happy/">Trigger Happy</a> can add triggers to Foundry, for example when a token moves onto another token, or when it is clicked.
Global Shared Vision can be triggered through Trigger Happy on a 'click' or 'move' trigger.<br>
You set this up like you would any other trigger, and you add 'shareVision=true', 'shareVision=false' or 'shareVision=toggle' to the '@Trigger' pseudo link.<br>
<br>
<b>Example:</b><br>
To enable Global Shared Vision when a token moves unto another token called 'test', you use:<br>
'@Token[test] @Trigger[move shareVision=true]'<br>
<br>
For more info on how to use Trigger Happy, please read the <a href="https://github.com/League-of-Foundry-Developers/fvtt-module-trigger-happy/blob/master/README.md">documentation</a>.
        
![triggerHappy](https://github.com/CDeenen/SharedVision/blob/master/img/examples/TriggerHappy.png)

<h2>Hey, Wait!</h2>
<a href="https://foundryvtt.com/packages/hey-wait/">Hey, Wait!</a> allows you to place a tile on the scene, and when a token moves onto that tile, the game pauses and the scene shifts to the player's token.<br>
You can set Shared Vision up to enable Global Shared Vision when Hey, Wait! is triggered.<br>
<br>
Follow the <a href="https://github.com/1000nettles/hey-wait/blob/main/README.md">Hey, Wait! instructions</a> to create a 'Hey, Wait! tile'.<br>
Selecting and then right-clicking this tile will open the HUD which will show the eye icon. Pressing this icon will enable Global Shared Vision on the Hey, Wait! trigger.

![heyWait](https://github.com/CDeenen/SharedVision/blob/master/img/examples/HeyWait.png)

<h2>Triggering using hooks</h2>
If you want to enable or disable the Global Shared Vision using macros or a different module, you can call the following hooks:<br>
<br>
<b>Enable:</b> Hooks.call("setShareVision",{enable:true})<br>
<b>Disable:</b> Hooks.call("setShareVision",{enable:false})<br>
<b>Toggle:</b> Hooks.call("setShareVision",{enable:'toggle'})<br>

<h1>Module Compatibility</h1>
Shared Vision overrides the default 'Token.prototype._isVisionSource' method while vision sharing is enabled. This could cause conflicts with other modules.<br>
For this reason, <a href="https://foundryvtt.com/packages/lib-wrapper/">libWrapper</a> was implemented.<br>
<br>
<a href="https://foundryvtt.com/packages/midi-qol/">Midi QOL</a> has the 'Players control owned hidden tokens' setting that could cause issues. By default it should work fine, but if you have libWrapper installed and Midi QOL is set to a higher priority than Shared Vision, Shared Vision will no longer work.<br>
<br>
Grape-Juice's Isometric module is currently not compatible, but this will hopefully change soon

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

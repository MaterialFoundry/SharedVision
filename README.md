<h1>Shared Vision</h1>
Shared Vision is a module that provides an easy way to share vision between multiple tokens.<br>
The reasoning behind this is that, when dugeon delving, the player in the back of the marching order will miss out on all the awesome stuff that's happening at the front.<br>
The GM might have prepared an awesome cut-scene, with vivid descriptions, but the wizard at the back isn't in the same room yet as the fighter in the front, so the wizard's player is missing out on all the action!<br>
<br>
Shared Vision allows the GM to press a button, and the vision between specified tokens will be shared between all players, so everyone gets to enjoy the cool stuff at the front.<br>
<br>
Besides pressing a button, Shared Vision can also be triggered using <a href="https://foundryvtt.com/packages/trigger-happy/">Trigger Happy</a> and <a href="https://foundryvtt.com/packages/hey-wait/">Hey, Wait!</a>

<h1>Instructions</h1>
<h2>Actor Configuration</h2>
To configure which tokens should share their vision when share vision is enabled, you must go to the 'Permission Configuration' for the actor of that token.<br>
You can find this screen by selecting the 'Actors Directory' in the sidebar, right-clicking the actor, and pressing 'Configure Permissions'.<br>
<br>
The 'Permission Configuration' screen will now open, and at the bottom there is a checkbox named 'Enable Shared Vision'. By checking this checkbox, all tokens of this actor will share their vision.<br>
Players do not need to have any permissions in order for the tokens to share their view. This will work if the token is an NPC or even if it is invisible.<br>
You could, for example, add invisible tokens to a scene where you want everyone to be able to see everything.

![permissionConfiguration](https://github.com/CDeenen/SharedVision/blob/master/img/examples/PermissionConfiguration.png)

<h2>Control Button</h2>
You can enable or disable shared vision using a control button in the 'Basic Controls'. The control button has an eye icon, and is toggleable.

![controlButtons](https://github.com/CDeenen/SharedVision/blob/master/img/examples/ControlButtons.png)

<h2>Trigger Happy</h2>
<a href="https://foundryvtt.com/packages/trigger-happy/">Trigger Happy</a> can add triggers to Foundry, for example when a token moves onto another token, or when it is clicked.
Shared Vision can be triggered through Trigger Happy on a 'click' or 'move' trigger.<br>
You set this up like you would any other trigger, and you add 'shareVision=true', 'shareVision=false' or 'shareVision=toggle' to the '@Trigger' pseudo link.<br>
<br>
<b>Example:</b><br>
To enable shared vision when a token moves unto another token called 'test', you use '@Token[test] @Trigger[move shareVision=true]'<br>
<br>
For more info on how to use Trigger Happy, please read the <a href="https://github.com/League-of-Foundry-Developers/fvtt-module-trigger-happy/blob/master/README.md">documentation</a>.

![triggerHappy](https://github.com/CDeenen/SharedVision/blob/master/img/examples/TriggerHappy.png)

<h2>Hey, Wait!</h2>
<a href="https://foundryvtt.com/packages/hey-wait/">Hey, Wait!</a> allows you to place a tile on the scene, and when a token moves onto that tile, the game pauses and the scene shifts to the player's token.<br>
You can set Shared Vision up to enable shared vision when Hey, Wait! is triggered.<br>

Follow the <a href="https://github.com/1000nettles/hey-wait/blob/main/README.md">Hey, Wait! instructions</a> to create a 'Hey, Wait! tile'.<br>
Selecting and then right-clicking this tile will open the HUD which will show the eye icon. Pressing this icon will enable vision sharing on the Hey, Wait! trigger.

![heyWait](https://github.com/CDeenen/SharedVision/blob/master/img/examples/HeyWait.png)

<h2>Triggering using hooks</h2>
If you want to enable or disable the shared vision using macros or a different module, you can call the following hooks:<br>
<br>
<b>Enable:</b> Hooks.call("setShareVision",{enable:true})<br>
<b>Disable:</b> Hooks.call("setShareVision",{enable:false})<br>
<b>Toggle:</b> Hooks.call("setShareVision",{enable:'toggle'})<br>

<h1>Module Compatibility</h1>
Shared Vision overrides the default 'Token.prototype._isVisionSource' method while vision sharing is enabled. This could cause conflicts with other modules.<br>
For this reason, <a href="https://foundryvtt.com/packages/lib-wrapper/">libWrapper</a> was implemented.

<h1>Feedback</h1>
If you have any suggestions or bugs to report, feel free to submit an <a href="https://github.com/CDeenen/SharedVision/issues">issue</a>, contact me on Discord (Cris#6864), or send me an email: cdeenen@outlook.com.

<h1>Credits</h1>
<b>Author:</b> Cristian Deenen (Cris#6864 on Discord)<br>
<br>
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

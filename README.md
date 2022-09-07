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

<h1>Instructions</h1>

<h2>Module Settings</h2>
In the Shared Vision module settings, you can find 2 buttons. The first buttons opens a help menu containing the same documentation as this readme, while the second opens the module configuration.<br>
<br>
<h3>Configuration</h3>
The module configuration window can be divided into 2 secions: 'Ownership & Disposition' and 'Combat'.<br>
<br>

<h4><b>Ownership & Disposition</b></h3>
Here you can configure vision, token and fog of war sharing depending on the ownership level of tokens or their disposition. 
These settings apply to all tokens, regardless of what has been configured in the actor's vision config.<br>
<br>
Each ownership level or disposition type has 3 options:
<ul>
    <li><b>Vision</b>: Share vision (automatically enables 'Token' and 'Fog')</li>
    <li><b>Token</b>: Share the token's location by drawing the token icon on the canvas, even if the token is not in view of the user</li>
    <li><b>Fog</b>: Share fog of war exploration</li>
</ul>
For example, checking 'vision' for 'Observer' will allow a user to see the vision of all tokens on the canvas that the user has observer ownership for.<br>
<br>

<h4><b>Combat</b></h3>
In the 'Combat' section, you can configure 'Global Shared Vision' or 'Disable All Vision Sharing' to be enabled or disabled when combat starts or stops. 
This will activate or deactivate the corresponding control buttons.
<ul>
    <li><b>Enable Global Shared Vision</b>: Shares the vision for actors with enabled 'Global Shared Vision' in the actor's 'Permission Configuration' screen</li>
    <li><b>Disable All Vision Sharing</b>: Disables all vision/token/fog sharing</li>
</ul>

![moduleSettings](https://github.com/CDeenen/SharedVision/blob/master/img/examples/ModuleSettings.png)

<h2>Vision Config</h2>
To configure which tokens should share their vision, you must go to the 'Vision Config' for the actor of that token.<br>
You can find this screen by selecting the 'Actors Directory' in the sidebar, right-clicking the actor, and pressing 'Shared Vision'.
The 'Vision Config' screen will now open.<br>
<br>
To configure which tokens should share their vision, you must go to the 'Vision Config' for the actor of that token.<br>
You can find this screen by selecting the 'Actors Directory' in the sidebar, right-clicking the actor, and pressing 'Shared Vision'.
The 'Vision Config' screen will now open.<br>
<br>
The 'Global Shared Vision' checkbox determines if this actor should share its vision if the 'Global Shared Vision' control button is enabled.<br>
<br>
Ticking the 'Share Hidden' checkbox will result in the actor sharing its vision even if the actor's tokens are hidden/invisible.<br>
You could, for example, add invisible tokens to a spot where you want everyone to be able to see.<br>
<br>
Below that you'll find a table with each user's name, with the following checkboxes:
<ul>
    <li><b>Vision</b>: Share vision (automatically enables 'Token' and 'Fog')</li>
    <li><b>Token</b>: Share the token's location by drawing the token icon on the canvas, even if the token is not in view of the user</li>
    <li><b>Fog</b>: Share fog of war exploration</li>
</ul>

These settings are enabled regardless of whether 'Global Shared Vision' is enabled.<br>

Players do not need to have any permissions in order for the tokens to share their view, token location or fog exploration. This will also work if the token is an NPC.<br>

![permissionConfiguration](https://github.com/CDeenen/SharedVision/blob/master/img/examples/PermissionConfiguration.png)

<h2>Control Buttons</h2>
Shared vision has 2 control buttons located in the 'Token Controls':
<ul>
    <li><b>Enable Global Shared Vision</b>: Shares the vision for actors with enabled 'Global Shared Vision' in the actor's 'Permission Configuration' screen</li>
    <li><b>Disable All Vision Sharing</b>: Disables all vision/token/fog sharing</li>
</ul>
        
![controlButtons](https://github.com/CDeenen/SharedVision/blob/master/img/examples/ControlButtons.png)

<h2>Trigger Happy</h2>
Global Shared Vision can be enabled through <a href="https://foundryvtt.com/packages/trigger-happy/">Trigger Happy</a> triggers, for example when a token moves onto another token, or when it is clicked.<br>
You set this up like you would any other trigger, and you add `@SharedVision[toggle]`, `@SharedVision[enable]` or `@SharedVision[disable]` trigger to toggle, enable or disable Global Shared Vision, respectively.<br>
<br>
<b>Example:</b><br>
To enable Global Shared Vision when a token moves unto another token called 'test', you use:<br>
`@Token[test] @Trigger[move] @SharedVision[enable]`<br>
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
If you want to enable or disable 'Global Shared Vision' or 'Disable All Vision Sharing' using macros or a different module, you can call the following hook:<br>
<pre>
    Hooks.call("setSharedVision",{
        globalSharedVision: [true/false/'toggle'],
        disableAll: [true/false/'toggle']
    })
</pre>
Where you have to select either 'true', 'false' or '"toggle"' (note the quotation marks around 'toggle')

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

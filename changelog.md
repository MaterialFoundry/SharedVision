# Changelog
### v1.2.0 - 18-07-2024
Update is thanks to @muhahahahe

-Made compatible with Foundry v12<br>
-Minor code cleanup<br>
-Changed prototype name to remove conflict with other modules<br>
-Removed 'author' property from module.json<br>
-Fixed translation issue for actor dispositions in v11+<br>
-Added 'secret' disposition<br>
-Fixed issue in v12 where deselecting tokens would not stop sharing vision<br>

Known issues:<br>
-Fog of war sharing is broken in v12<br>
-Setting changes aren't updated immediately, some canvas interaction (such as moving tokens) is needed before vision is updated


### v1.1.2 - 01-10-2022
-Previous addition (in v1.1.0) to allow vision sharing for the GM resulted in some issues (see GitHub issue #26), so this has been removed. Will be added again when a solution is found<br>
-Fixed MidiQOL compatibility

### v1.1.1 - 07-09-2022
-Fixed error when libWrapper was enabled in v10

### v1.1.0 - 06-09-2022
-Made compatible with Foundry v10<br>
-Added options to share the token location and fog exploration of tokens, without sharing their vision. Can be configured in the Vision Config for actors, or in the module settings for ownership/disposition.<br>
-All module settings have been moved to a menu within the module settings<br>
-The GM can now also be configured to share vision to<br>
-Added a 'Disable All' control button which disables all vision/token/fog sharing<br>
-Changed the 'Enable Global Shared Vision' icon to a globe<br>
-Changed to hook to control module functions from 'setShareVision' to 'setSharedVision'<br>
-Added option to trigger 'Global Shared Vision' or 'Disable All' on combat start and end

### v1.0.9 - 08-07-2022
Something went wrong with the previous update for Forge users. This should be fixed now.

### v1.0.8 - 05-07-2022
-Fixed issue where the user settings in the vision config wouldn't save under certain circumstances<br>
-Fixed Trigger Happy compatibility<br>
-Fog of War is now updated for tokens that share their vision<br>
-Fixed issue where shared vision would not be properly applied after a refresh

### v1.0.7 - 17-12-2021
-Added option to share vision with tokens based on disposition<br>
-Fixed compatibility issue with midi-qol<br>
-Fixed compatibility with Foundry v0.9

### v1.0.6 - 21-06-2021
-Fixed bug where the scene would not load for players if there's a hidden token present.

### v1.0.5 - 21-06-2021
-In Foundry 0.8, foreground layers have been added. When non-owned tokens that share vision move underneath a foreground tile, this tile will now become transparant.<br>
-Some game systems, such as Shadowrun 5e, convert array actor flags to objects, which caused errors. This should now be fixed.<br>
-Confirmed compatibility with Foundry 0.8.7.

### v1.0.4 - 26-05-2021
-Made compatible with Foundry 0.8.5 -The vision configuration has been removed from the actor permission configuration screen. Instead, it now has its own configuration screen. You can find this by right-clicking an actor in the Actors Directory, and selecting 'Shared Vision'.

### v1.0.3 - 18-02-2021
-Added setting to the Actor Permission Configuration to enable or disabled vision sharing for hidden/invisible tokens.

### v1.0.2 - 15-02-2021
-Fixed issue where the canvas would not load with Shared Vision enabled

### v1.0.1 - 12-02-2021
-Minor improvements and fixes<br>
-Added option to always share vision based on actor permission level<br>
-Added option to specify actors that will always share vision with specific players

### v1.0.0 - 10-02-2021
Initial release<br>
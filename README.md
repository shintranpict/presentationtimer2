# Time Keeper2
HTML5 and JavaScript based timer with notification chime for academic conference or seminars.

### How to Use?
Access to
https://tranpict.gitlab.io/presentationtimer/

It is based on the following URL and added functionality to flash at alarms. Also, core logic was refactored a bit.
http://maruta.github.io/timekeeper/  

You can use local copy of this repository.

**:bangbang: Be careful to turn off screen savers and automatic screen cut :bangbang:**

### How to Save the Settings?
All **parameters** are reflected on the URL immediately after change.
* Simply **bookmark** the current URL with relevant name for each purpose.
 - For example, 
 1. saving default URL as for the presentation at XXX symposium, 
 2. and saving another URL with different name as for the presentation at YYY conference after changing parameters.

#### Chrome with local copy
If you are using Chrome and running local copy of Time Keeper2,
certain version of Chrome (and maybe depend on settings) does not permit to update the URL due to a security reason.
 * Time Keeper2 logo on left-top is the link to the URL with the current setting, and can be used to get the URL.

### How to Customize Appearance?

 * Edit presentationtimer/public/theme/default.css
 * By using class added to the body tag, the appearance can be changed according to the phase and state of the timer.
 * Theme can be specified via URL as  
   https://tranpict.gitlab.io/presentationtimer/#th=example  
   In this case, presentationtimer/public/theme/example.css will be loaded in place of default.css.

### License
Presentationtimer(Time Keeper2) is open-sourced software licensed under The MIT License.

This repository contains codes from
 * [jQuery](https://jquery.org/license/) licensed under MIT License
 * [jQuery UI](https://jqueryui.com/) belongs to [OpenJS foundation](https://openjsf.org) and is same license as jQuery.
 * [jQuery Timer plugin](http://www.mattptr.net/) licensed under BSD License
 * [Bootstrap](https://github.com/twbs/bootstrap/blob/master/LICENSE) licensed under MIT License

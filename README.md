# Javascript-i18n-core
Simple i18n solution for javascript.

Online demo: 
https://code.essoduke.org/i18n

## Quick start
```javascript
import i18n from '/path/i18n.es6.js';

i18n.set({
    "resource": "/path/language.json",
    "locale": "en"
}).init(function () {
    // Do something.
    // this._("string key");
});
```
## Usage
```javascript
let foo = i18n._("string key");

// use "." for multiple level
let foo = i18n._("anime.japan"); // output "Japanese Douga"
let foo = i18n._("anime.japan.attact_on_titan"); // output "Attact On Titan"
```
### Variables
```javascript
// by object
const conan = {
    "year": 2022,
    "num": 99
};
let foo = i18n._("anime.japan.detective conan", conan); // output "2022 Vol.99"
// by array
let foo = i18n._("anime.japan.detective conan", [2022, 99]); // output "2022 Vol.99"
// by arguments
let foo = i18n._("anime.japan.detective conan", 2022, 99); // output "2022 Vol.99"
```
### Change language
```javascript
// Change default language 
i18n.set('locale', 'jp')._("string key"); // string in english
i18n._("string key"); // string in japanese
// Get specific language
i18n._("en", "string key"); // string in english
i18n._("string key"); // string in japanese
```
### Auto translate
```html
<div data-i18n="string key">...</div>
<div data-i18n-pass="{"name": "value"...}"></div>
<div data-i18n-pass="[value1, value2...]"></div>
```
```javascript
// Initialize
i18n.set(...).init(function () {
    i18n.translate();
});

// Event trigger
button.addEventListener("click", function () {
    // auto translate in default language
    i18n.translate()
    
    // auto translate in specific language 
    // it won't change the default language setting
    i18n.translate('jp');    
});
```
### Datetime
```javascript
// Datetime of default format
let foo = i18n.now();
// Format in specific language
let foo = i18n.now('language key');
// Custom format
let foo = i18n.now('language key', 'format');
```
## Language file example
```javascript
{
    "Language key": {
        "__meta__": { // for datetime use.
            "datetime": "PHP like",
            "timezone": "UTC offset"
            "day": ["Mon", "Tue", "Wed"...], // abbr of day
            "days": ["Monday", "Tuesday", "Wednesday"...], // full name of day
            "month": ["Jan", "Feb", "Mar"...], // abbr of month
            "months": ["Janurary", "February", "March"...] // full name of month            
        },
        // Example {"key": "value"}
        "string key": "string", // String
        "string key": { // object
            "string key": {
                "string key": {...}
            }
        }
    }
}
```

## License
javascript-i18n-core was release under [MIT License](http://opensource.org/licenses/MIT).

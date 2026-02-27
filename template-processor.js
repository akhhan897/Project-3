'use strict';

// Constructor function
function TemplateProcessor(template) {
  this.template = template;
}

// Prototype method
TemplateProcessor.prototype.fillIn = function fillIn(dictionary) {
  const dict = dictionary || {};

  // Replace all occurrences of {{property}} where property is letters/numbers/underscore
  return this.template.replace(/{{\s*([A-Za-z0-9_]+)\s*}}/g, function (_match, prop) {
    // If property missing in dictionary, replace with empty string
    if (Object.prototype.hasOwnProperty.call(dict, prop)) {
      return String(dict[prop]);
    }
    return '';
  });
};
window.TemplateProcessor = TemplateProcessor;

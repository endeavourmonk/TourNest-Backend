const fs = require('fs');

const renderEmailTemplate = async (templatePath, replacements) => {
  try {
    let emailTemplate = await fs.readFileSync(templatePath, 'utf8');

    Object.entries(replacements).forEach(([key, val]) => {
      const placeholder = `{{\\s*${key}\\s*}}`;
      emailTemplate = emailTemplate.replace(new RegExp(placeholder, 'g'), val);
    });

    return emailTemplate;
  } catch (err) {
    // console.error('Error reading template:', err);
    throw new Error(`Error Sending mail. ${err}`);
  }
};

module.exports = renderEmailTemplate;

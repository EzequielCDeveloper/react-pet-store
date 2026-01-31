const fs = require('fs');
const path = require('path');

const swaggerPath = path.join(__dirname, '../swagger.json');
const outputPath = path.join(__dirname, '../API_INVENTORY.md');

try {
  const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  
  let output = '# API Inventory\n\n';
  
  // 1. Base URL, schemes, consumes/produces
  output += '## 1. General Info\n';
  output += `- **Host**: ${swagger.host || 'N/A'}\n`;
  output += `- **BasePath**: ${swagger.basePath || '/'}\n`;
  output += `- **Schemes**: ${swagger.schemes ? swagger.schemes.join(', ') : 'N/A'}\n`;
  output += `- **Consumes**: ${swagger.consumes ? swagger.consumes.join(', ') : 'N/A'}\n`;
  output += `- **Produces**: ${swagger.produces ? swagger.produces.join(', ') : 'N/A'}\n\n`;

  // 2. Tags
  output += '## 2. Tags\n';
  if (swagger.tags) {
    swagger.tags.forEach(tag => {
      output += `- **${tag.name}**: ${tag.description || ''}\n`;
    });
  } else {
    output += 'No tags defined.\n';
  }
  output += '\n';

  // 3. Paths + Methods + OperationId
  output += '## 3. Endpoints\n';
  Object.keys(swagger.paths).forEach(pathKey => {
    const pathObj = swagger.paths[pathKey];
    Object.keys(pathObj).forEach(method => {
      const op = pathObj[method];
      output += `- \`${method.toUpperCase()} ${pathKey}\` (OperationId: \`${op.operationId || 'N/A'}\`)\n`;
      if (op.tags) {
        output += `  - Tags: ${op.tags.join(', ')}\n`;
      }
      if (op.summary) {
        output += `  - Summary: ${op.summary}\n`;
      }
    });
  });
  output += '\n';

  // 4. Models/Schemas
  output += '## 4. Models\n';
  if (swagger.definitions) {
    Object.keys(swagger.definitions).forEach(defName => {
      output += `- **${defName}**\n`;
    });
  }
  output += '\n';

  // 5. Auth/Security
  output += '## 5. Security Definitions\n';
  if (swagger.securityDefinitions) {
    Object.keys(swagger.securityDefinitions).forEach(secKey => {
      const sec = swagger.securityDefinitions[secKey];
      output += `- **${secKey}** (${sec.type})\n`;
      if (sec.type === 'apiKey') {
        output += `  - In: ${sec.in}, Name: ${sec.name}\n`;
      }
      if (sec.authorizationUrl) {
        output += `  - Auth URL: ${sec.authorizationUrl}\n`;
      }
      if (sec.flow) {
        output += `  - Flow: ${sec.flow}\n`;
      }
    });
  } else {
    output += 'No security definitions.\n';
  }

  fs.writeFileSync(outputPath, output);
  console.log('API Inventory generated at API_INVENTORY.md');

} catch (err) {
  console.error('Error generating inventory:', err);
}

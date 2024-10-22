# CodeBlocks

An application that translate children CodeBlock toys into Google's Blockly Code

# Docker

## Build Image

```
docker build -t codeblocks .
```

## Run Docker Image

Bind the container to port 3000 on localhost:

```
docker run -p 127.0.0.1:3000:3000 --name codeblocks codeblocks
```

# General Naming Guidelines

- Do follow a pattern that describes the symbol's feature then its type. The recommended pattern is feature.type.ts.

  - Do use conventional type names including .service, .component, .pipe, .module, and .directive. Invent additional type names if you must but take care not to create too many.
  - Unabbreviated type names such as .service are descriptive and unambiguous. Abbreviations such as .srv, .svc, and .serv can be confusing.
  - To distinguish custom components from built-in components, it’s a good practice to use a prefix, such as “app-” or “my-”

- Names of folders and files should clearly convey their intent. For example, app/heroes/hero-list.component.ts may contain a component that manages a list of heroes.

- Bootstrapping

  - Do put bootstrapping and platform logic for the application in a file named main.ts.
  - Do include error handling in the bootstrapping logic.
  - Avoid putting application logic in main.ts. Instead, consider placing it in a component or service.

- File and Folder Naming:

  - Use kebab-case for file and folder names.
  - The filename should describe the content of the file.
  - The name of the file should match the name of the class it exports.

- Component Naming:

  - Use PascalCase for component names.
  - Use a noun or noun phrase to describe the component’s purpose.
  - Avoid generic names like “Component” or “Wrapper”.
  - Use a suffix to indicate the type of component (e.g., “Component”, “Directive”, “Pipe”, etc.).

- Service Naming:

  - Use PascalCase for service names.
  - Use a noun or noun phrase to describe the service’s purpose.
  - Use a suffix of “Service” to indicate that it is a service.

- Variable Naming:

  - Use camelCase for variable names.
  - Use descriptive names that clearly convey the purpose of the variable.
  - Avoid single-letter variable names, except for loop counters.
  - Use consistent naming for related variables.

- Function Naming:

  - Use camelCase for function names.
  - Use a verb or verb phrase to describe the function’s purpose.
  - Use descriptive names that clearly convey the function’s purpose.
  - Use consistent naming for related functions.

- Constant Naming:

  - Use uppercase letters and underscores to separate words in constant names.
  - Use descriptive names that clearly convey the purpose of the constant.
  - Use consistent naming for related constants.

- CSS Naming Convention
  - Use hyphenated (kebab-case) names for classes and IDs.
  - Use descriptive names that reflect the purpose or content of the element.
  - Avoid using abbreviated or cryptic names.
  - Use lowercase letters for class and ID names.

# References

- Angular Style Guide: https://angular.io/guide/styleguide
- Angular File Structure Guide: https://angular.io/guide/styleguide#application-structure-and-ngmodules
- Blockly API: https://developers.google.com/blockly/guides/configure/advanced/using_blockly_apis

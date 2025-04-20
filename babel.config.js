module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-private-property-in-object',
    ],
    overrides: [
      {
        // Configuración para los plugins que manejan métodos y propiedades privadas
        plugins: [
          [
            '@babel/plugin-transform-private-methods',
            {
              loose: true,
            },
          ],
          [
            '@babel/plugin-transform-class-properties',
            {
              loose: true,
            },
          ],
          [
            '@babel/plugin-transform-private-property-in-object',
            {
              loose: true,
            },
          ],
        ],
      },
    ],
  };
  
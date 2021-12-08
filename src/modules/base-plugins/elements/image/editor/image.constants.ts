export const predefinedStyles = [
  {
    styles: {
      boxShadow: 'none',
    },
    form: {
      border: {
        hasBorder: false,
        borderWidth: 0,
      },
      shadow: {
        hasShadow: false,
      },
    },
  },
  {
    styles: {
      boxShadow: 'rgba(0,0,0,0.5) 0px 0px 5px 1px',
    },
    form: {
      border: {
        hasBorder: false,
        borderWidth: 0,
      },
      shadow: {
        hasShadow: true,
        shadowBlur: 5,
        shadowOffset: 0,
        shadowOpacity: 50,
        shadowAngle: 0,
        shadowColor: '#000000',
      },
    },
  },
  {
    styles: {
      boxShadow: 'rgba(0,0,0,0.5) 0px -4px 5px 1px',
    },
    form: {
      border: {
        hasBorder: false,
        borderWidth: 0,
      },
      shadow: {
        hasShadow: true,
        shadowBlur: 5,
        shadowOffset: 4,
        shadowOpacity: 50,
        shadowAngle: 90,
        shadowColor: '#000000',
      },
    },
  },
  {
    styles: {
      border: '2px solid #000000',
    },
    form: {
      border: {
        hasBorder: true,
        borderStyle: 'solid',
        borderColor: '#000000',
        borderWidth: 2,
      },
      shadow: {
        hasShadow: false,
      },
    },
  },
  {
    styles: {
      border: '4px double #000000',
    },
    form: {
      border: {
        hasBorder: true,
        borderStyle: 'double',
        borderColor: '',
        borderWidth: 4,
      },
      shadow: {
        hasShadow: false,
      },
    },
  },
  {
    styles: {
      boxShadow: 'rgba(0,0,0, 0.5) -4px -2px 0px 2px',
    },
    form: {
      border: {
        hasBorder: false,
        borderWidth: 0,
        borderStyle: 'solid',
      },
      shadow: {
        hasShadow: true,
        shadowBlur: 0,
        shadowOffset: 4,
        shadowOpacity: 100,
        shadowAngle: 145,
        shadowColor: '#000000',
      },
    },
  },
];

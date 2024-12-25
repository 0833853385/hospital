import { createTheme } from '@mui/material/styles';

const themeConfig = {
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 700,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
        html: {
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
        },
        body: {
          width: '100%',
          height: '100%',
          fontFamily: 'Roboto, sans-serif',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        input: {
          '&[type=number]': {
            MozAppearance: 'textfield',
            '&::-webkit-outer-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
            '&::-webkit-inner-spin-button': {
              margin: 0,
              WebkitAppearance: 'none',
            },
          },
        },
        img: {
          display: 'block',
          maxWidth: '100%',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#f5f5f5', // Use a placeholder color
            '&:hover': {
              backgroundColor: '#e0e0e0', // Use a placeholder color
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
        },
        head: {
          color: '#757575', // Use a placeholder color
          backgroundColor: '#f5f5f5', // Use a placeholder color
          '&:first-of-type': {
            paddingLeft: 24, // Use a placeholder spacing
            borderTopLeftRadius: 4, // Use a placeholder border radius
            borderBottomLeftRadius: 4, // Use a placeholder border radius
            boxShadow: 'inset 8px 0 0 #ffffff', // Use a placeholder color
          },
          '&:last-of-type': {
            paddingRight: 24, // Use a placeholder spacing
            borderTopRightRadius: 4, // Use a placeholder border radius
            borderBottomRightRadius: 4, // Use a placeholder border radius
            boxShadow: 'inset -8px 0 0 #ffffff', // Use a placeholder color
          },
        },
        stickyHeader: {
          backgroundColor: '#ffffff', // Use a placeholder color
          backgroundImage: 'linear-gradient(to bottom, #f5f5f5 0%, #f5f5f5 100%)', // Use a placeholder color
        },
        body: {
          '&:first-of-type': {
            paddingLeft: 24, // Use a placeholder spacing
          },
          '&:last-of-type': {
            paddingRight: 24, // Use a placeholder spacing
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: 'solid 1px #e0e0e0', // Use a placeholder color
        },
        toolbar: {
          height: 64,
        },
        select: {
          '&:focus': {
            borderRadius: 4, // Use a placeholder border radius
          },
        },
        selectIcon: {
          width: 20,
          height: 20,
          marginTop: -4,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            '& svg': { color: '#bdbdbd' }, // Use a placeholder color
          },
        },
        input: {
          '&::placeholder': {
            opacity: 1,
            color: '#bdbdbd', // Use a placeholder color
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: '#bdbdbd', // Use a placeholder color
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#e0e0e0', // Use a placeholder color
          '&:hover': {
            backgroundColor: '#d6d6d6', // Use a placeholder color
          },
          '&.Mui-focused': {
            backgroundColor: '#cfcfcf', // Use a placeholder color
          },
          '&.Mui-disabled': {
            backgroundColor: '#f5f5f5', // Use a placeholder color
          },
        },
        underline: {
          '&:before': {
            borderBottomColor: '#bdbdbd', // Use a placeholder color
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#bdbdbd', // Use a placeholder color
          },
          '&.Mui-disabled': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#f5f5f5', // Use a placeholder color
            },
          },
        },
      },
    },
  },
};

const theme = createTheme(themeConfig);

export default theme;

export type TypographyTypes =
    | 'heading-1'
    | 'heading-2'
    | 'heading-3'
    | 'title-1'
    | 'title-2'
    | 'title-3'
    | 'title-4'
    | 'title-5'
    | 'body-1'
    | 'body-2'
    | 'body-3'
    | 'hyperlink';

export const typography: {
    [key in TypographyTypes]: {
        [key in string]: string | number;
    };
} = {
    'heading-1': {
        fontWeight: 600,
        fontSize: '45px',
    },
    'heading-2': {
        fontWeight: 600,
        fontSize: '34px',
    },
    'heading-3': {
        fontWeight: 700,
        fontSize: '24px',
    },
    'title-1': {
        fontWeight: 800,
        fontSize: '20px',
    },
    'title-2': {
        fontWeight: 700,
        fontSize: '18px',
    },
    'title-3': {
        fontWeight: 700,
        fontSize: '16px',
    },
    'title-4': {
        fontWeight: 600,
        fontSize: '14px',
    },
    'title-5': {
        fontWeight: 600,
        fontSize: '12px',
    },
    'body-1': {
        fontWeight: 500,
        fontSize: '14px',
    },
    'body-2': {
        fontWeight: 500,
        fontSize: '12px',
    },
    'body-3': {
        fontWeight: 600,
        fontSize: '10px',
    },
    hyperlink: {
        fontWeight: 500,
        fontSize: '14px',
        color: '#127FBF',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
};

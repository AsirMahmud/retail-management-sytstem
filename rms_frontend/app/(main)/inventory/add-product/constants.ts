// Global sizes object
export const globalSizes = {
    pants: {
        men: {
            US: ["28", "30", "32", "34", "36", "38", "40", "42", "44"],
            EU: ["44", "46", "48", "50", "52", "54", "56", "58"],
            UK: ["28", "30", "32", "34", "36", "38", "40", "42"],
            Asia: ["M", "L", "XL", "XXL", "3XL"],
            international: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
        },
        women: {
            US: ["0", "2", "4", "6", "8", "10", "12", "14", "16"],
            EU: ["32", "34", "36", "38", "40", "42", "44", "46"],
            UK: ["4", "6", "8", "10", "12", "14", "16", "18"],
            Asia: ["S", "M", "L", "XL", "XXL"],
            international: ["XS", "S", "M", "L", "XL", "XXL"],
        },
    },
    shoes: {
        men: {
            US: ["6", "7", "8", "9", "10", "11", "12"],
            UK: ["5.5", "6.5", "7.5", "8.5", "9.5", "10.5"],
            EU: ["39", "40", "41", "42", "43", "44", "45"],
            Asia: ["240", "245", "250", "255", "260", "265", "270", "275", "280"], // mm
        },
        women: {
            US: ["5", "6", "7", "8", "9", "10"],
            UK: ["3", "4", "5", "6", "7"],
            EU: ["36", "37", "38", "39", "40", "41"],
            Asia: ["220", "225", "230", "235", "240", "245", "250"], // mm
        },
    },
    belts: {
        inches: ["28", "30", "32", "34", "36", "38", "40", "42"],
        cm: ["70", "75", "80", "85", "90", "95", "100", "105", "110"],
        Asia: ["S", "M", "L", "XL", "XXL"],
        international: ["S", "M", "L", "XL", "XXL"],
    },
    underwear: {
        men: {
            waistInches: ["28", "30", "32", "34", "36", "38"],
            international: ["XS", "S", "M", "L", "XL", "XXL"],
            Asia: ["M", "L", "XL", "XXL", "3XL"],
        },
        women: {
            dressSize: ["4", "6", "8", "10", "12"],
            international: ["XS", "S", "M", "L", "XL"],
            Asia: ["S", "M", "L", "XL", "XXL"],
        },
    },
    jersey: {
        men: {
            US: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
            UK: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
            EU: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
            Asia: ["M", "L", "XL", "XXL", "3XL"],
            international: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
        },
        women: {
            US: ["XS", "S", "M", "L", "XL", "XXL"],
            UK: ["XS", "S", "M", "L", "XL", "XXL"],
            EU: ["XS", "S", "M", "L", "XL", "XXL"],
            Asia: ["S", "M", "L", "XL", "XXL"],
            international: ["XS", "S", "M", "L", "XL", "XXL"],
        },
    },
    shirts: {
        men: {
            US: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
            UK: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
            EU: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
            Asia: ["M", "L", "XL", "XXL", "3XL"],
            international: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
        },
        women: {
            US: ["XS", "S", "M", "L", "XL", "XXL"],
            UK: ["XS", "S", "M", "L", "XL", "XXL"],
            EU: ["XS", "S", "M", "L", "XL", "XXL"],
            Asia: ["S", "M", "L", "XL", "XXL"],
            international: ["XS", "S", "M", "L", "XL", "XXL"],
        },
    },
    tshirts: {
        men: {
            US: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
            UK: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
            EU: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
            Asia: ["M", "L", "XL", "XXL", "3XL"],
            international: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
        },
        women: {
            US: ["XS", "S", "M", "L", "XL", "XXL"],
            UK: ["XS", "S", "M", "L", "XL", "XXL"],
            EU: ["XS", "S", "M", "L", "XL", "XXL"],
            Asia: ["S", "M", "L", "XL", "XXL"],
            international: ["XS", "S", "M", "L", "XL", "XXL"],
        },
    },
} as const;

// Color constants with hex values
export const COLORS = {
    Black: "#000000",
    White: "#FFFFFF",
    Red: "#FF0000",
    Blue: "#0000FF",
    Green: "#008000",
    Yellow: "#FFFF00",
    Purple: "#800080",
    Orange: "#FFA500",
    Pink: "#FFC0CB",
    Brown: "#A52A2A",
    Gray: "#808080",
    Navy: "#000080",
    Teal: "#008080",
    Maroon: "#800000",
    Olive: "#808000",
    Silver: "#C0C0C0",
    Gold: "#FFD700",
    Beige: "#F5F5DC",
    Burgundy: "#800020",
    Khaki: "#F0E68C",
} as const; 
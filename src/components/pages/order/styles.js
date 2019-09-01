export default theme=>({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    // tableWrapper: {
    //     overflowX: 'auto',
    // },
    menuListText: {
        fontSize: " 0.80rem",
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
        maxWidth: 300,
    },

    regular_price: {
        fontSize: 12,
        marginRight: 5
    },
    isDiscount: {
        textDecoration: 'line-through',
        fontSize: 12,
        color: '#484848'
    },
    discount_value: {
        color: '#e53935',

        fontSize: 12

    },
    discountPercentage: {
        color: '#e53935',
        padding: "0px 10px",
        fontSize: 12
    },
    noDiscount: {
        opacity: 0,

        fontSize: 16
    },
    productDiscountPricing: {
        display: 'flex',
        alignItems: 'center'
    },
    colorCompleted:{
        color:"white",
        background:"#11a738"
    },
    colorCancelled:{
        color: "black",
        background:"#f9c209"
    },
    colorConfirmPayment:{
        background:"#1f1f1b",
        color:"white"
    }

})
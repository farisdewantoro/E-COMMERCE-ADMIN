export default theme=>({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    menuListText: {
        fontSize: " 0.80rem",
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
        padding:"0px 10px",
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
 
    
})
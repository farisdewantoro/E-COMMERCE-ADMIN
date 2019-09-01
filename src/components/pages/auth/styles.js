export default theme=>({
    wrapperLogin:{
        width:"100%",
        minHeight:"100vh",
        backgroundColor:"#eaeaeb"
    },
    cover: {
        width:'100%',
    },
    card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]:{
            minWidth: "50%"
        },
        [theme.breakpoints.down('sm')]:{
    minWidth: "100%"
}
        
    },
    content: {
        flex: '1 0 auto',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
     
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    playIcon: {
        height: 38,
        width: 38,
    },
})
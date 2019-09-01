import React from 'react'
import PropTypes from 'prop-types'
import {
    Typography
} from '@material-ui/core';
function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }
function readerImg(img) {
    var image = new Image();

    image.src = img;

    let dimension = image.onload = () => {
        let d = image.width + 'x' + image.height;
        return d;

    };

    return dimension();

}
const Images = props => {
    const {img} = props;
    return (
        <div>
            <img
                src={img.original}
                style={{ width: '100%' }}
                alt={'hammer'}
                title={'hammerstout-image'}
            />
            <div style={{
                textAlign: 'center',
                marginTop: 5
            }} >
                <Typography>
                    {img.original}
                </Typography>
                <Typography>
                    Dimension {readerImg(img.original)}
                </Typography>
                <Typography>
                    Size  {formatBytes(img.size)}
                </Typography>

            </div>
        </div>
    )
}
// Image.propTypes={
//     img:PropTypes.object.isRequired
// }


export default Images

import React from 'react'
import moment from 'moment-timezone'
import Countdown from 'react-countdown'
import { Typography } from '@material-ui/core'

export default ({ annotator, children }) => {
    return (
        <Countdown
            date={moment(annotator.updatedAt).add(45, 'seconds').toDate()}
            renderer={({ completed, minutes, seconds }) => {
                if (!completed) {
                    return (
                        <Typography variant="subtitle1" align="center">
                            You can submit a vote in {seconds} seconds.
                        </Typography>
                    )
                } else {
                    return children
                }
            }}
        />
    )
}

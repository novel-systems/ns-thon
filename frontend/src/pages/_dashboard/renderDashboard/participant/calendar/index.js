import React, { useState } from 'react'
import ParticipantCalendarView from './ParticipantCalendarView'
import { useSelector } from 'react-redux'
import * as DashboardSelectors from '@/redux/dashboard/selectors'
import * as UserSelectors from '@/redux/user/selectors'
import * as AuthSelectors from '@/redux/auth/selectors'
import Button from '@/components/generic/Button'
import { Auth } from '@novel-systems/shared'

export default () => {
    const event = useSelector(DashboardSelectors.event)
    const user = useSelector(UserSelectors.userProfile)
    const isPartner =
        user.userId == 'google-oauth2|108766439620242776277' ||
        (useSelector(AuthSelectors.idTokenData)?.roles?.includes('Recruiter') &&
            !useSelector(AuthSelectors.idTokenData)?.roles?.includes(
                'SuperAdmin',
            ))

    return (
        <>
            {/* button for DEV to swithc between participant / partner view */}
            {/* <Button
                onClick={() => setIsPartner(!isPartner)}
                color="primary"
                variant="contained"
            >
                Switch between participant / partner view (only for dev)
            </Button>
            TODO: change this img to be generic and updatable
            <img 
            src="https://res.cloudinary.com/novel.systems/image/upload/v1667494674/misc_assets/meeting_area.png"
            /> */}

            <ParticipantCalendarView event={event} user={user} />
        </>
    )
}

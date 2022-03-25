import { Box, Button } from '@mui/material'
import React, { useEffect, useRef } from 'react'

interface Props {
    buttonText: string
    onButtonClick: () => void
}

const VideoStream: React.ForwardRefRenderFunction<
    HTMLVideoElement,
    Props
> = ({buttonText}, ref) => {
    const videoRef = useRef<null | HTMLVideoElement>(null)

    const getVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: { width: 300 } })
            .then((stream) => {
                const video = videoRef.current
                if (!video) return
                video.srcObject = stream
                video.play()
            })
            .catch((err) => {
                console.error('error:', err)
            })
    }

    useEffect(() => {
        getVideo()
    }, [videoRef])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return
        const detections = '1'
    }, [videoRef])

    return (
        <Box
            display="flex"
            flexDirection="column"
            maxHeight="25vh"
            justifyContent="center"
            alignItems="center"
        >
            {/* eslint-disable-next-line */}
            <video style={{overflow:"hidden"}} ref={ref} />
            <Button
                onClick={() => {
                    console.log('Clicked!!')
                }}
            >
                Take my picture!!
            </Button>
        </Box>
    )
}

export default React.forwardRef(VideoStream)

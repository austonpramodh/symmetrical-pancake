import React, { useEffect, useRef } from 'react'
import * as faceApi from 'face-api.js'
import { Container, Typography, Box } from '@mui/material'

const expressionMap = {
    neutral: '😶',
    happy: '😄',
    sad: '😞',
    angry: '🤬',
    fearful: '😖',
    disgusted: '🤢',
    surprised: '😲',
}

let mediaStream: MediaStream | null = null

export const FaceRecognition: React.FunctionComponent = () => {
    // Analyze the mood now
    const videoRef = useRef<null | HTMLVideoElement>(null)

    const [state, setState] = React.useState<{
        expressions: (string | number)[][]
    }>({
        expressions: [],
    })

    const detectFaces = async () => {
        const video = videoRef.current

        if (!video) return

        if (
            video.paused ||
            video.ended ||
            !faceApi.nets.tinyFaceDetector.params
        ) {
            setTimeout(() => detectFaces())
            return
        }

        const options = new faceApi.TinyFaceDetectorOptions({
            inputSize: 512,
            scoreThreshold: 0.5,
        })

        const result = await faceApi
            .detectSingleFace(video, options)
            .withFaceExpressions()

        if (result) {
            console.log(result)
            const expressions = result.expressions
                .asSortedArray()
                .reduce((acc, { expression, probability }) => {
                    const emoji =
                        expressionMap[expression as keyof typeof expressionMap]

                    acc.push([expression, emoji, probability])
                    return acc
                }, [] as (string | number)[][])
            setState((prevState) => ({
                ...prevState,
                expressions,
            }))
            console.log(expressions)
        }

        setTimeout(() => detectFaces(), 1000)
    }

    const initializeFaceDetector = async () => {
        const video = videoRef.current
        if (!video) return

        try {
            await faceApi.nets.tinyFaceDetector.load('/models/')
            await faceApi.loadFaceExpressionModel(`/models/`)
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
            })

            video.srcObject = mediaStream
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        initializeFaceDetector()
    }, [])

    return (
        <Container>
            <Typography variant="h4" mb={2}>
                Facial Expression Recognition through Webcam
            </Typography>
            <Box display="flex">
                <Box mr={2}>
                    <video ref={videoRef} autoPlay muted onPlay={detectFaces} />
                </Box>

                <Box ml={2}>
                    {state.expressions
                        .sort((a, b) => (b[2] as number) - (a[2] as number))
                        .map(([exp, emoji, probability]) => {
                            const value =
                                typeof probability === 'number'
                                    ? Math.round(probability * 1000) / 1000
                                    : parseFloat(probability).toFixed(4)

                            if (value === 0) return null

                            return (
                                <p key={`${exp}-${probability}`}>
                                    {exp} - {emoji} - {value}
                                </p>
                            )
                        })}
                </Box>
            </Box>
        </Container>
    )
}

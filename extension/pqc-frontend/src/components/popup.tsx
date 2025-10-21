import React, { useState, useEffect } from 'react';
import browser from 'webextension-polyfill'


// The imports needed from mui
import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Card,
    CardContent,
    Alert,
    Chip
} from '@mui/material'

import { CheckCircle, Cancel, Security, Language } from '@mui/icons-material';


// object of response
interface PQCRespone{
    isReady: boolean;
}


// object of error message
interface ErrorMessage{
    error: string;
}


const PQCChecker: React.FC = () => {
    const [hostname, setHostname] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);


    // Ensuring this is only ran once,
    // when the extension first opens
    useEffect(() => {
        getCurrentTabUrl();
    }, [])

    // this gets the current tab url
    const getCurrentTabUrl = async () => {
        try {
            const tabs = await browser.tabs.query({active: true, currentWindow: true});
            const currTab = tabs[0];

            // if we have a url, we set the hostname
            if (currTab.url){
                const url = new URL(currTab.url)
                setHostname(url.hostname)
            }
        } catch (err){

            // else try and get it from the window
            try {
                const url = new URL(window.location.href)
                setHostname(url.hostname)
            } catch {
                setError('Failed to get the current tabs URL ;(')
            }

        }
    }

    // check the readiness,
    const checkReadiness = async () => {

        // do we have a hostname?
        // if not return
        if(!hostname.trim()) {
            setError('No hostname has been found')
            return
        }
    
        // we know we havent errored out,
        // we set loading to true
        setLoading(true)
        setError(null)
        setResult(null)

        try {
            // now we fetch from our backend
            const response = await fetch(`https://pqc-extension.vercel.app/?hostname=${encodeURIComponent(hostname)}`)

            // if we do not havw a good response, then we have an error
            if (!response.ok){
                throw new Error(`HTTP error! ${response.status}`)
            }

            // now we get our data,
            // it will either be a response or an ErrorMessage
            const data: PQCRespone | ErrorMessage = await response.json()

            if ('error' in data){
                setError(data.error) // if its an error display an errorMessage
            } else {
                setResult(data.isReady) // if its ready, we know we are good!!
            }
        } catch (err) {
            setError("Error")
        } finally {
            setLoading(false)
        }
    }

    // getting if it is a success or an error
    const getStatusColor = () => {
        if (result === null) return 'default'
        return result ? 'success' : 'error'
    }

    // Getting the status Icon for the extension
    const getStatusIcon = () => {
        if (result === null) return <Security />
        return result ?  <CheckCircle /> : <Cancel />
    }

    // This is what we display back to the user
    const getStatusText = () => {
        if (result === null) return "Unknown....."
        return result ? 'Ready!' : 'Not Ready'
    }


    // All HTML / React rendering,
    // go through it
    return (
        <Box sx={{ width: 350, p: 2 }}>
            <Card elevation={2}>
                <CardContent>
                    <Typography variant="h6" component="h1" gutterBottom align="center">
                        PQC Checker
                    </Typography>
                    
                    {hostname && (
                        <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Language fontSize="small" />
                                {hostname}
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={checkReadiness} // CTA
                            disabled={loading || !hostname}
                            startIcon={loading ? <CircularProgress size={20} /> : <Security />}
                            sx={{ height: 48 }}
                        >
                            {loading ? 'Checking...' : 'Check PQC Readiness'}
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {result !== null && (
                        <Box sx={{ textAlign: 'center' }}>
                            <Chip
                                icon={getStatusIcon()}
                                label={getStatusText()}
                                color={getStatusColor()}
                                variant="filled"
                                size="medium"
                                sx={{
                                    fontWeight: 'bold',
                                    py: 2,
                                }}
                            />
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {result 
                                    ? 'This site supports PQC!'
                                    : 'This site does not support PQC.'
                                }
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default PQCChecker;



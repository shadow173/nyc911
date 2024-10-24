import fetch from 'node-fetch'
import FormData from 'form-data'

async function testVerificationSubmission() {
    try {
        // Create a form data instance
        const formData = new FormData()
        
        // Add the file as a buffer
        const fileBuffer = Buffer.from('Sample verification document content')
        formData.append('file', fileBuffer, {
            filename: 'verification-document.pdf',
            contentType: 'application/pdf'
        })
        
        // Add all other fields
        formData.append('role', 'dispatcher')
        formData.append('name', 'Test Dispatcher')
        formData.append('companyName', 'NYC Emergency Services')
        formData.append('streetAddress', '11 MetroTech Center')
        formData.append('city', 'Brooklyn')
        formData.append('state', 'NY')
        formData.append('zipCode', '11201')

        // Make the request
        const response = await fetch('http://localhost:3001/auth/submitVerificationForm', {
            method: 'POST',
            body: formData,
            headers: {
                ...formData.getHeaders()
            }
        })

        console.log('Response status:', response.status)
        
        // Get the raw response text first
        const responseText = await response.text()
        console.log('Raw response:', responseText)
        
        // Try to parse as JSON if possible
        try {
            const result = JSON.parse(responseText)
            console.log('Parsed response:', result)
        } catch (error) {
            console.log('Could not parse response as JSON')
        }

    } catch (error) {
        console.error('Test failed:', error)
        if (error instanceof Error) {
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
        }
    }
}

// Run the test
console.log('Starting verification submission test...')
testVerificationSubmission()
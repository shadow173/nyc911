import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'

async function testVerificationUpload() {
    // Create a test file with proper typing
    const testFileName = 'verification-document.pdf'
    const testFileContent = new Uint8Array(Buffer.from('Sample verification document content'))
    fs.writeFileSync(testFileName, testFileContent)

    try {
        // Read the test file
        const fileStream = fs.createReadStream(testFileName)

        // Create form data
        const form = new FormData()
        form.append('file', fileStream, {
            filename: testFileName,
            contentType: 'application/pdf'
        })
        
        // Add all other required fields
        form.append('role', 'dispatcher')
        form.append('name', 'Test Dispatcher')
        form.append('companyName', 'NYC Emergency Services')
        form.append('streetAddress', '11 MetroTech Center')
        form.append('city', 'Brooklyn')
        form.append('state', 'NY')
        form.append('zipCode', '11201')

        // Send the request
        const response = await axios.post(
            'http://localhost:3001/auth/submitVerificationForm',
            form,
            {
                headers: {
                    ...form.getHeaders(),
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            }
        )

        console.log('Upload result:', response.data)

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Upload failed:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            })
        } else {
            console.error('Error during upload:', error)
        }
    } finally {
        // Clean up the test file
        try {
            fs.unlinkSync(testFileName)
            console.log('Test file cleaned up')
        } catch (error) {
            console.error('Error cleaning up test file:', error)
        }
    }
}

// Run the test
console.log('Starting verification upload test...')
testVerificationUpload().catch(console.error)

export { testVerificationUpload }
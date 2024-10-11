

export const checkAPIKey = (apiKeyToCheck: string) => {
    const apiKey = process.env.APIKEY

    if(apiKeyToCheck === apiKey) {
        return true
    }
    else{
        return false;
    }
}

// api key
//jahewbfhjgsebfjuyhgsebgfjhsebfjhsebfsehjb


// NYC911-67f1efb3-63e4-42be-8a3e-d0cb992e4bb5-27774f84-f52d-4339-b0ad-1db953d4993a-4c1a-aea4-6d98d4cbe031
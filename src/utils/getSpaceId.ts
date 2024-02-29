import axios from 'axios';


export default async function getSpaceId(address: string) {
    
    const res = await axios.get(`https://sleepy-refuge-41618-b7a2dec9b357.herokuapp.com/https://api.prd.space.id/v1/getName?tld=arb1&address=${address}`)
    return await res
}
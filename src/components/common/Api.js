const fetchApiData = async ( endpoint, pageSize = 100) => {
    const domain = process.env.REACT_APP_API_DOMAIN;
    const apiKey = process.env.REACT_APP_API_KEY;
    const base64Credentials = btoa(`${domain}:${apiKey}`);

    try {
        const urlTotal = `/Api/v3/job/list?page=1&pageSize=1`;
        const responseTotal = await fetch(urlTotal, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${base64Credentials}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!responseTotal.ok) {
            throw new Error(`HTTP error! status: ${responseTotal.status}`);
        }

        const responseDataTotal = await responseTotal.json();
        const totalRegistros = responseDataTotal.recordsTotal;
        const totalPages = Math.ceil(totalRegistros / pageSize);
        const allData = [];

        for (let page = 1; page <= totalPages; page++) {
            const url = `/Api/v3/job/list?page=${page}&pageSize=${pageSize}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${base64Credentials}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            //console.log(responseData);
            allData.push(...responseData.data);
        }
        return allData;
        
    } catch (error) {
        console.error('No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo nuevamente.', error);
        throw error;
    }
};

export default fetchApiData;

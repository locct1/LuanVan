import axios from 'axios';
export const callAPIClassifyComments = async (data) => {
    let response = await axios.post(
        ` http://127.0.0.1:5000/predict_sentiment
    `,
        data,
    );
    return response.data;
};

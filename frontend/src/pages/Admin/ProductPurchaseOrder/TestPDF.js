import { hostUpdateReservationSelector } from '~/redux/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { capitalizeFirstLetter } from '~/helpers/covertString';
import React, { Fragment } from 'react';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import { PDFViewer } from '@react-pdf/renderer';
function TestPDF() {
    return (
        <PDFViewer>
            <h1>dsds</h1>
        </PDFViewer>
    );
}

export default TestPDF;

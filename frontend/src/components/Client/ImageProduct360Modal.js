import { Button, Modal } from 'react-bootstrap';
import { LINK_PRODUCT_COLOR_PRODUCT_DEFAULT_IMAGE } from '~/helpers/constants';
import moment from 'moment';

import 'moment/locale/vi';
import useScript from '~/hooks/useScript';
function ImageProduct360Modal({ show, onClose, imageProduct360 }) {
    useScript('https://cdn.scaleflex.it/plugins/js-cloudimage-360-view/2.7.1/js-cloudimage-360-view.min.js');
    console.log(imageProduct360);
    return (
        <>
            <Modal show={show} onHide={onClose} dialogClassName="modal-70w">
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title className="font-weight-bold text-light">Chi tiết đơn đặt hàng:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-6 col-md-6">
                                <div>
                                    <div
                                        className="cloudimage-360"
                                        data-folder="https://localhost:7077/Uploads/ImageProduct360/"
                                        data-filename={`${imageProduct360.fileName}-{index}.${imageProduct360.extension}`}
                                        data-amount={36}
                                        data-box-shadow="inset 0 0 100px #222"
                                        data-bottom-circle="true"
                                        data-autoplay="true"
                                        data-magnifier={2}
                                        data-full-screen="true"
                                    >
                                        <button className="cloudimage-360-prev" />
                                        <button className="cloudimage-360-next" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ImageProduct360Modal;

import { useState, useEffect } from "react";
import { Button, Container, FormControl, Table, Image } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

let Update = () => {
    let { id } = useParams();
    let location = useLocation();
    let userInfo = location.state.userInfo;
    let [inputs, setInputs] = useState({
        name: '',
        content: '',
        address: '',
        startEntry: '',
        endEntry: '',
        roomNumber: '',
        roomMember: '',
        price: '',
        shortContent: ''
    });
    let [files, setFiles] = useState([]);
    let [imageUrls, setImageUrls] = useState([]);

    let navigate = useNavigate();

    let onChange = (e) => {
        let { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    let onFileChange = (e) => {
        let selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        const urls = selectedFiles.map(file => URL.createObjectURL(file));
        setImageUrls(urls);
    };

    let uploadFiles = async (files) => {
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('file', files[i]);
            }

            let resp = await axios.post('http://localhost:8080/hotel/uploads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            return resp.data.urls;
        } catch (error) {
            console.error('Error uploading files:', error);
            return [];
        }
    };

    let onSubmit = async (e) => {
        e.preventDefault();
        try {
            const fileUrls = await uploadFiles(files);

            const hotelDTO = {
                ...inputs,
                imagePaths: fileUrls
            };

            let resp = await axios.post(`http://localhost:8080/hotel/update`, { ...hotelDTO, id }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (resp.status === 200) {
                navigate(`/hotel/showOne/${resp.data.destId}`, { state: { userInfo: userInfo } });
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    useEffect(() => {
        let getUpdate = async () => {
            let resp = await axios.get(`http://localhost:8080/hotel/showOne/${id}`, {
                withCredentials: true
            });

            if (resp.status === 200) {
                setInputs(resp.data);
                setImageUrls(resp.data.imagePaths || []);
            }
        };

        getUpdate();
    }, [id]);

    return (
        <Container className={"mt-3"}>
            <form onSubmit={onSubmit}>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <td colSpan={2} className={"text-center"}>{id}번 글 수정하기</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>호텔 명</td>
                        <td>
                            <FormControl
                                type={'text'}
                                name={'name'}
                                value={inputs.name}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>설명</td>
                        <td>
                            <textarea
                                name={'content'}
                                className={'form-control'}
                                value={inputs.content}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>주소</td>
                        <td>
                            <FormControl
                                type={'text'}
                                name={'address'}
                                value={inputs.address}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>시작 날짜</td>
                        <td>
                            <FormControl
                                type={'date'}
                                name={'startEntry'}
                                value={inputs.startEntry}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>종료 날짜</td>
                        <td>
                            <FormControl
                                type={'date'}
                                name={'endEntry'}
                                value={inputs.endEntry}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>방 번호</td>
                        <td>
                            <FormControl
                                type={'number'}
                                name={'roomNumber'}
                                value={inputs.roomNumber}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>방 인원</td>
                        <td>
                            <FormControl
                                type={'number'}
                                name={'roomMember'}
                                value={inputs.roomMember}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>가격</td>
                        <td>
                            <FormControl
                                type={'number'}
                                name={'price'}
                                value={inputs.price}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>썸네일 설명</td>
                        <td>
                            <FormControl
                                type={'text'}
                                name={'shortContent'}
                                value={inputs.shortContent}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>파일 업로드</td>
                        <td>
                            <input
                                type="file"
                                name="file"
                                multiple
                                onChange={onFileChange}
                            />
                        </td>
                    </tr>
                    {imageUrls.length > 0 && (
                        <tr>
                            <td colSpan={2}>
                                <div className="d-flex flex-wrap">
                                    {imageUrls.map((url, index) => (
                                        <Image
                                            key={index}
                                            src={url}
                                            thumbnail
                                            style={{ marginRight: '10px', marginBottom: '10px' }}
                                        />
                                    ))}
                                </div>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan={2} className={'text-center'}>
                            <Button type={'submit'}>
                                수정하기
                            </Button>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </form>
        </Container>
    );
};

export default Update;

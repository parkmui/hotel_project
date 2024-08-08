import { useState, useEffect } from "react";
import { Button, Container, FormControl, Table } from "react-bootstrap";
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
        start_entry: '',
        end_entry: '',
        room_number: '',
        room_member: '',
        price: '',
        short_content: ''
    });
    let [files, setFiles] = useState([]);

    let navigate = useNavigate();

    let onChange = (e) => {
        let { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    };

    let onFileChange = (e) => {
        setFiles(e.target.files);
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
                }
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
                                name={'start_entry'}
                                value={inputs.start_entry}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>종료 날짜</td>
                        <td>
                            <FormControl
                                type={'date'}
                                name={'end_entry'}
                                value={inputs.end_entry}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>방 번호</td>
                        <td>
                            <FormControl
                                type={'number'}
                                name={'room_number'}
                                value={inputs.room_number}
                                onChange={onChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>방 인원</td>
                        <td>
                            <FormControl
                                type={'number'}
                                name={'room_member'}
                                value={inputs.room_member}
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
                                name={'short_content'}
                                value={inputs.short_content}
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

import { useState } from "react";
import { Button, Container, FormControl, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

let Write = () => {
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
    let [imageUrls, setImageUrls] = useState([]);
    let [thumbnail, setThumbnail] = useState(null);

    let navigate = useNavigate();

    let moveToNext = (id) => {
        navigate(`/hotel/showOne/${id}`);
    };

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

            // Randomly select a thumbnail from the uploaded image URLs
            const randomIndex = Math.floor(Math.random() * fileUrls.length);
            const selectedThumbnail = fileUrls[randomIndex];

            const hotelDTO = {
                ...inputs,
                imagePaths: fileUrls,
                thumbnail: selectedThumbnail // Use the randomly selected thumbnail
            };

            let resp = await axios.post('http://localhost:8080/hotel/write', hotelDTO, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (resp.data.resultId !== undefined) {
                moveToNext(resp.data.resultId);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <Container className={"mt-3"}>
            <form onSubmit={onSubmit}>
                <Table striped hover bordered>
                    <thead>
                    <tr>
                        <td colSpan={2} className={"text-center"}>글 작성하기</td>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Form fields for text input */}
                    <tr>
                        <td>호텔 명</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.name}
                                name={'name'}
                                onChange={onChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>설명</td>
                        <td>
                            <textarea
                                name={'content'}
                                value={inputs.content}
                                className={"form-control"}
                                onChange={onChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>주소</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.address}
                                name={'address'}
                                onChange={onChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>시작 날짜</td>
                        <td>
                            <FormControl
                                type={'date'}
                                value={inputs.start_entry}
                                name={'start_entry'}
                                onChange={onChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>종료 날짜</td>
                        <td>
                            <FormControl
                                type={'date'}
                                value={inputs.end_entry}
                                name={'end_entry'}
                                onChange={onChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>방 번호</td>
                        <td>
                            <FormControl
                                type={'number'}
                                value={inputs.room_number}
                                name={'room_number'}
                                onChange={onChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>방 인원</td>
                        <td>
                            <FormControl
                                type={'number'}
                                value={inputs.room_member}
                                name={'room_member'}
                                onChange={onChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>가격</td>
                        <td>
                            <FormControl
                                type={'number'}
                                value={inputs.price}
                                name={'price'}
                                onChange={onChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>썸네일 설명</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.short_content}
                                name={'short_content'}
                                onChange={onChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>파일 업로드</td>
                        <td>
                            <input
                                type="file"
                                name="file"
                                multiple
                                onChange={onFileChange} />
                        </td>
                    </tr>
                    {files.length > 0 && (
                        <tr>
                            <td colSpan={2} className={'text-center'}>
                                <Button type={'submit'}>
                                    작성하기
                                </Button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </form>
        </Container>
    );
};

export default Write;

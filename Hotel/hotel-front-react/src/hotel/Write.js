import {useState, useEffect} from "react";
import {Button, Container, FormControl, Table, Image} from "react-bootstrap";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";

let Write = () => {
    let location = useLocation();
    let userInfo = location.state.userInfo;

    console.log(userInfo)

    let [inputs, setInputs] = useState({
        name: '',
        content: '',
        address: '',
        startEntry: '',
        endEntry: '',
        roomNumber: '',
        roomMember: '',
        price: '',
        shortContent: '',
        sellerId: userInfo.id
    });
    let [files, setFiles] = useState([]);
    let [imageUrls, setImageUrls] = useState([]);
    let [thumbnail, setThumbnail] = useState(null);
    let [sellerId, setSellerId] = useState(null);

    let navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setSellerId(userId);
    }, []);

    let moveToNext = (id) => {
        navigate(`/hotel/showOne/${id}`, {state: {userInfo: userInfo}});
    };

    let onChange = (e) => {
        let {name, value} = e.target;
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

            const randomIndex = Math.floor(Math.random() * fileUrls.length);
            const selectedThumbnail = fileUrls[randomIndex];

            const hotelDTO = {
                ...inputs,
                sellerId: userInfo.id,
                imagePaths: fileUrls,
                thumbnail: selectedThumbnail
            };

            let resp = await axios.post('http://localhost:8080/hotel/write', hotelDTO, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
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
                    <tr>
                        <td>호텔 명</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.name}
                                name={'name'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>설명</td>
                        <td>
                            <textarea
                                name={'content'}
                                value={inputs.content}
                                className={"form-control"}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>주소</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.address}
                                name={'address'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>시작 날짜</td>
                        <td>
                            <FormControl
                                type={'date'}
                                value={inputs.startEntry}
                                name={'startEntry'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>종료 날짜</td>
                        <td>
                            <FormControl
                                type={'date'}
                                value={inputs.endEntry}
                                name={'endEntry'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>방 번호</td>
                        <td>
                            <FormControl
                                type={'number'}
                                value={inputs.roomNumber}
                                name={'roomNumber'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>방 인원</td>
                        <td>
                            <FormControl
                                type={'number'}
                                value={inputs.roomMember}
                                name={'roomMember'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>가격</td>
                        <td>
                            <FormControl
                                type={'number'}
                                value={inputs.price}
                                name={'price'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>썸네일 설명</td>
                        <td>
                            <FormControl
                                type={'text'}
                                value={inputs.shortContent}
                                name={'shortContent'}
                                onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>파일 업로드</td>
                        <td>
                            <input
                                type="file"
                                name="file"
                                multiple
                                onChange={onFileChange}/>
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
                                            style={{marginRight: '10px', marginBottom: '10px'}}
                                        />
                                    ))}
                                </div>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan={2} className={'text-center'}>
                            <Button type={'submit'}>
                                작성하기
                            </Button>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </form>
        </Container>
    );
};

export default Write;

import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Table, Image } from "react-bootstrap";

let ShowOne = () => {
    let [data, setData] = useState({});
    let params = useParams();
    let id = parseInt(params.id);

    let location = useLocation();
    let userInfo = location.state.userInfo;

    let navigate = useNavigate();
    let goBack = () => {
        navigate(-1);
    };

    let onUpdate = () => {
        navigate('/hotel/update/' + id, { state: { userInfo: userInfo } });
    };

    useEffect(() => {
        let selectOne = async () => {
            try {
                let resp = await axios.get('http://localhost:8080/hotel/showOne/' + id, {
                    withCredentials: true
                });
                if (resp.status === 200) {
                    setData(resp.data);
                }
            } catch (e) {
                console.error(e);
            }
        };
        selectOne();
    }, [id]);

    let onLogout = async () => {
        let response = await axios.post('http://localhost:8080/user/logOut', {}, {
            withCredentials: true
        });

        if (response.status === 200) {
            navigate('/');
        }
    };

    let onDelete = async () => {
        let response = await axios.get('http://localhost:8080/hotel/delete/' + id, {
            withCredentials: true
        });

        if (response.status === 200) {
            navigate('/hotel/showList/1', { state: { userInfo: userInfo } });
        }
    };

    let isAdmin = userInfo.role === 'role_admin';

    return (
        <Container className={"mt-3"}>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <td colSpan={2} className={'text-end'}>
                        <Button onClick={onLogout}>로그아웃</Button>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan={2}>제목: {data.name}</td>
                </tr>
                <tr>
                    <td colSpan={2}>글번호: {data.id}</td>
                </tr>
                <tr>
                    <td colSpan={2}>작성자: {data.nickname}</td>
                </tr>
                <tr>
                    <td colSpan={2}>주소: {data.address}</td>
                </tr>
                <tr>
                    <td colSpan={2}>시작 일자: {data.startEntry}</td>
                </tr>
                <tr>
                    <td colSpan={2}>종료 일자: {data.endEntry}</td>
                </tr>
                <tr>
                    <td colSpan={2}>방 넘버: {data.roomNumber}</td>
                </tr>
                <tr>
                    <td colSpan={2}>방 인원수: {data.roomMember}</td>
                </tr>
                <tr>
                    <td colSpan={2}>가격: {data.price}</td>
                </tr>
                <tr>
                    <td colSpan={2}>내용</td>
                </tr>
                <tr>
                    <td colSpan={2}>{data.content}</td>
                </tr>
                {data.imagePaths && data.imagePaths.length > 0 && (
                    <tr>
                        <td colSpan={2}>
                            <div className="d-flex flex-wrap">
                                {data.imagePaths.map((url, index) => (
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
                {isAdmin && (
                    <tr>
                        <td>
                            <Button onClick={onUpdate}>수정하기</Button>
                        </td>
                        <td>
                            <Button onClick={onDelete}>삭제하기</Button>
                        </td>
                    </tr>
                )}
                {data.sellerId === userInfo.id && !isAdmin && (
                    <tr>
                        <td>
                            <Button onClick={onUpdate}>수정하기</Button>
                        </td>
                        <td>
                            <Button onClick={onDelete}>삭제하기</Button>
                        </td>
                    </tr>
                )}
                <tr>
                    <td colSpan={2} className={"text-center"}>
                        <Button onClick={goBack}>뒤로 가기</Button>
                    </td>
                </tr>
                </tbody>
            </Table>
        </Container>
    );
};

export default ShowOne;

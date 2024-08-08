import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Container, Pagination, Table, Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

let ShowList = () => {
    let location = useLocation()
    let userInfo = location.state.userInfo
    let params = useParams()
    let pageNo = params.pageNo
    let [data, setData] = useState({hotelList: []})
    let navigate = useNavigate()

    let moveToSingle = (id) => {
        navigate('/hotel/showOne/' + id, {state: {userInfo: userInfo}})
    }

    let moveToPage = (pageNo) => {
        navigate('/hotel/showList/' + pageNo, {state: {userInfo: userInfo}})
    }

    useEffect(() => {
        let selectList = async () => {
            try {
                let resp = await axios.get("http://localhost:8080/hotel/showList/" + pageNo, {
                    withCredentials: true
                })
                if (resp.status === 200) {
                    setData(resp.data)
                }
            } catch (e) {
                console.error(e)
            }
        }
        selectList()
    }, [pageNo])

    let isSeller = userInfo.role === 'role_seller'

    return (
        <Container className={"mt-3"}>
            <div className="row mt-3 mb-3">
                <div className="col-6 offset-3">
                    <form className="d-flex" action="/hotel/showAll/1" method="get">
                        <select className="form-select me-2" name="searchType">
                            <option value="name">호텔명</option>
                            <option value="address">주소</option>
                        </select>
                        <input className="form-control me-2" type="text" placeholder="검색어를 입력하세요" aria-label="Search"
                               name="keyword"/>
                        <button className="btn btn-outline-primary" type="submit">검색</button>
                    </form>
                </div>
                <div className="row justify-content-start">
                    {isSeller && (
                        <div className="col-3">
                            <Button className="btn btn-outline-success" href="/hotel/write">글 작성하기</Button>
                        </div>
                    )}
                </div>
            </div>
            <Table hover striped bordered className={"table-danger"}>
                <thead>
                <tr>
                    <td>글 번호</td>
                    <td>제목</td>
                    <td>작성자</td>
                    <td>간략한 내용</td>
                </tr>
                </thead>
                <tbody>
                {data.hotelList.map(b => (
                    <TableRow hotel={b} key={b.id} moveToSingle={moveToSingle}/>
                ))}
                <tr>
                    <td colSpan={4} className={"text-center"}>
                        <MyPagination
                            startPage={data.startPage}
                            endPage={data.endPage}
                            currentPage={data.currentPage}
                            maxPage={data.maxPage}
                            moveToPage={moveToPage}
                        />
                    </td>
                </tr>
                </tbody>
            </Table>
        </Container>
    )
}

let TableRow = ({hotel, moveToSingle}) => {
    return (
        <tr onClick={() => moveToSingle(hotel.id)}>
            <td>{hotel.id}</td>
            <td>{hotel.name}</td>
            <td>{hotel.nickname}</td>
            <td>{hotel.shortContent}</td>
        </tr>
    )
}

let MyPagination = ({startPage, endPage, currentPage, maxPage, moveToPage}) => {
    let items = []
    items.push(
        <Pagination.First onClick={() => moveToPage(1)}/>
    )
    for (let i = startPage; i <= endPage; i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={() => moveToPage(i)}>
                {i}
            </Pagination.Item>
        )
    }
    items.push(
        <Pagination.Last onClick={() => moveToPage(maxPage)}/>
    )
    return (
        <Pagination className={"justify-content-center"}>
            {items}
        </Pagination>
    )
}

export default ShowList

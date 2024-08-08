package nc13.hotel.service;


import nc13.hotel.model.HotelDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class HotelService {
    private final SqlSession SESSION;
    private final String NAMESPACE = "mapper.HotelMapper";
    private final int PAGE_SIZE = 20;

    @Autowired
    public HotelService(SqlSession session) {
        SESSION = session;
    }

    public HotelDTO selectOne(int id) {
        return SESSION.selectOne(NAMESPACE + ".selectOne", id);
    }

    public List<HotelDTO> selectAll(int pageNo) {
        HashMap<String, Integer> paramMap = new HashMap<>();
        paramMap.put("startRow", (pageNo - 1) * PAGE_SIZE);
        paramMap.put("size", PAGE_SIZE);

        return SESSION.selectList(NAMESPACE + ".selectList", paramMap);
    }

    public int selectMaxPage() {
        int maxRow = SESSION.selectOne(NAMESPACE + ".selectMaxPage");
        int maxPage = maxRow / PAGE_SIZE;

        maxPage = (maxRow % PAGE_SIZE == 0) ? maxPage : maxPage + 1;

        return maxPage;
    }

    public void insert(HotelDTO hotelDTO) {
        SESSION.insert(NAMESPACE + ".insert", hotelDTO);
    }

    public void update(HotelDTO hotelDTO) {
        SESSION.update(NAMESPACE + ".update", hotelDTO);
    }

    public void delete(int id) {
        SESSION.delete(NAMESPACE + ".delete", id);
    }

    public List<HotelDTO> searchHotels(String searchType, String keyword) {
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("searchType", searchType);
        paramMap.put("keyword", keyword);
        paramMap.put("startRow", 0);
        paramMap.put("size", PAGE_SIZE);

        return SESSION.selectList(NAMESPACE + ".searchBoards", paramMap);
    }

}

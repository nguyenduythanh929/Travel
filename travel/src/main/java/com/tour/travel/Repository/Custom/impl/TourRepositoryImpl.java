package com.tour.travel.Repository.Custom.impl;

import com.tour.travel.Entity.TourEntity;
import com.tour.travel.dto.request.tour.TourFilterRequest;
import com.tour.travel.Repository.Custom.TourRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class TourRepositoryImpl implements TourRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<TourEntity> searchTours(TourFilterRequest request, Pageable pageable) {
        StringBuilder sql = new StringBuilder();
        StringBuilder join = new StringBuilder();
        StringBuilder where = new StringBuilder(" WHERE 1=1 ");

        buildJoins(join, request);

        buildWhere(where, request);

        sql.append("SELECT DISTINCT t.* FROM tours t ")
           .append(join).append(where)
           .append(" ORDER BY t.created_at DESC ")
           .append(" LIMIT ").append(pageable.getPageSize())
           .append(" OFFSET ").append(pageable.getOffset());

        Query query = entityManager.createNativeQuery(sql.toString(), TourEntity.class);
        List<TourEntity> tours = query.getResultList();

        long total = countTotalTours(request);

        return new PageImpl<>(tours, pageable, total);
    }

    private long countTotalTours(TourFilterRequest request) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(DISTINCT t.id) FROM tours t ");
        StringBuilder join = new StringBuilder();
        StringBuilder where = new StringBuilder(" WHERE 1=1 ");

        buildJoins(join, request);

        buildWhere(where, request);

        sql.append(join).append(where);
        Query query = entityManager.createNativeQuery(sql.toString());
        Object result = query.getSingleResult();
        return result == null ? 0 : ((Number) result).longValue();
    }

    private void buildJoins(StringBuilder join, TourFilterRequest request) {
        if (request.getTypeId() != null) {
            join.append(" JOIN tour_types tt ON t.tour_type_id = tt.id ");
        }

        if (request.getDestination() != null || request.getStartLocation() != null) {
            join.append(" LEFT JOIN tour_location tl ON t.id = tl.tour_id ");
            join.append(" LEFT JOIN locations l ON tl.location_id = l.id ");
        }

        if (request.getDepartureDate() != null) {
            join.append(" LEFT JOIN tour_departure_date tdd ON t.id = tdd.tour_id ");
            join.append(" LEFT JOIN departure_date dd ON dd.id = tdd.departure_date_id ");
        }
    }


    private void buildWhere(StringBuilder where, TourFilterRequest request) {
        if (request.getName() != null && !request.getName().isEmpty()) {
            where.append(" AND t.name LIKE '%").append(request.getName()).append("%' ");
        }
        if (request.getAdultCount() != null
                || request.getChildCount() != null
                || request.getInfantCount() != null) {

            if (request.getAdultCount() != null) {
                where.append(" AND (").append(request.getAdultCount()).append(" <= t.remain_adult) ");
            }
            if (request.getChildCount() != null) {
                where.append(" AND (").append(request.getChildCount()).append(" <= remain_child) ");
            }
            if (request.getInfantCount() != null) {
                where.append(" AND (").append(request.getInfantCount()).append(" <= t.remain_infant) ");
            }
        }
        if (request.getStartLocation() != null && !request.getStartLocation().isEmpty()) {
            where.append(" AND l.name LIKE '%").append(request.getStartLocation()).append("%'");
        }
        if (request.getDepartureDate() != null && !request.getDepartureDate().isEmpty()) {
            where.append(" AND dd.date = '").append(request.getDepartureDate()).append("'");
        }
        if (request.getPriceFrom() != null) {
            where.append(" AND t.price_adult >= ").append(request.getPriceFrom());
        }
        if (request.getPriceTo() != null) {
            where.append(" AND t.price_adult <= ").append(request.getPriceTo());
        }
        if (request.getTypeId() != null) {
            List<Integer> typeIds = getAllTypeIds(request.getTypeId());
            if (!typeIds.isEmpty()) {
                where.append(" AND tt.id IN (")
                        .append(typeIds.stream().map(String::valueOf).collect(Collectors.joining(",")))
                        .append(")");
            }
        }
        if (request.getCreatedBy() != null && !request.getCreatedBy().isEmpty()) {
            where.append(" AND t.created_by = '").append(request.getCreatedBy()).append("'");
        }
        if (request.getCreatedDate() != null) {
            where.append(" AND DATE(t.created_at) = '").append(request.getCreatedDate()).append("'");
        }
        if (request.getStatus() != null) {
            where.append(" AND t.status = ").append(request.getStatus());
        }
    }

    @SuppressWarnings("unchecked")
    private List<Integer> getAllTypeIds(Integer typeId) {
        List<Integer> ids = new ArrayList<>();
        ids.add(typeId);

        String sql = "SELECT id FROM tour_types WHERE parent_id = " + typeId;
        Query query = entityManager.createNativeQuery(sql);
        List<Integer> children = query.getResultList();

        for (Integer childId : children) {
            ids.addAll(getAllTypeIds(childId));
        }
        return ids;
    }

}

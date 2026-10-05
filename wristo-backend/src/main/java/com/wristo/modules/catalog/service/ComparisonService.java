package com.wristo.modules.catalog.service;

import com.wristo.exception.BusinessException;
import com.wristo.exception.ErrorCode;
import com.wristo.modules.catalog.dto.ComparisonMatrixResponse;
import com.wristo.modules.catalog.dto.ComparisonSpecItem;
import com.wristo.modules.catalog.dto.ComparisonWatchSummary;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.entity.WatchSpec;
import com.wristo.modules.catalog.repository.WatchRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ComparisonService {

    private static final int MIN_COMPARISON_ITEMS = 2;
    private static final int MAX_COMPARISON_ITEMS = 4;
    private final WatchRepository watchRepository;

    public ComparisonService(WatchRepository watchRepository) {
        this.watchRepository = watchRepository;
    }

    @Transactional(readOnly = true)
    public ComparisonMatrixResponse compareWatches(List<String> watchIds) {
        if (watchIds == null || watchIds.size() < MIN_COMPARISON_ITEMS) {
            throw new BusinessException(ErrorCode.COMPARE_MIN_LIMIT, "At least 2 watches are required for side-by-side comparison");
        }

        if (watchIds.size() > MAX_COMPARISON_ITEMS) {
            throw new BusinessException(ErrorCode.COMPARE_MAX_LIMIT, "Comparison is limited to a maximum of 4 watches");
        }

        List<Watch> watches = new ArrayList<>();
        for (String id : watchIds) {
            if (id == null || id.isBlank()) {
                continue;
            }
            Watch watch = watchRepository.findById(id.trim())
                    .orElseThrow(() -> new BusinessException(ErrorCode.WATCH_NOT_FOUND, "Watch not found with id: " + id));
            watches.add(watch);
        }

        if (watches.size() < MIN_COMPARISON_ITEMS) {
            throw new BusinessException(ErrorCode.COMPARE_MIN_LIMIT, "At least 2 watches are required for side-by-side comparison");
        }

        List<ComparisonWatchSummary> summaries = watches.stream()
                .map(ComparisonWatchSummary::from)
                .toList();

        List<ComparisonSpecItem> specs = buildComparisonSpecs(watches);

        return new ComparisonMatrixResponse(summaries, specs, watches.size());
    }

    private List<ComparisonSpecItem> buildComparisonSpecs(List<Watch> watches) {
        List<ComparisonSpecItem> specs = new ArrayList<>();

        // 1. Movement & Caliber
        Map<String, String> movementMap = new LinkedHashMap<>();
        for (Watch w : watches) {
            String val = w.getMovement() != null ? w.getMovement() : "High-Precision Horology Movement";
            movementMap.put(w.getId(), val);
        }
        specs.add(new ComparisonSpecItem("Movement & Caliber", "ENGINEERING", movementMap, true));

        // 2. Case Diameter & Dimensions
        Map<String, String> caseSizeMap = new LinkedHashMap<>();
        for (Watch w : watches) {
            WatchSpec spec = w.getSpecs();
            String val = (spec != null && spec.getCaseDiameterMm() != null)
                    ? spec.getCaseDiameterMm()
                    : (w.getCaseSize() != null ? w.getCaseSize() : "40mm");
            caseSizeMap.put(w.getId(), val);
        }
        specs.add(new ComparisonSpecItem("Case Diameter & Profile", "DIMENSIONS", caseSizeMap, false));

        // 3. Case Metallurgy
        Map<String, String> materialMap = new LinkedHashMap<>();
        for (Watch w : watches) {
            WatchSpec spec = w.getSpecs();
            String val = (spec != null && spec.getCaseMaterial() != null)
                    ? spec.getCaseMaterial()
                    : (w.getMaterial() != null ? w.getMaterial() : "316L Surgical Stainless Steel");
            materialMap.put(w.getId(), val);
        }
        specs.add(new ComparisonSpecItem("Case Metallurgy", "METALLURGY", materialMap, true));

        // 4. Dial & Sapphire Crystal
        Map<String, String> dialMap = new LinkedHashMap<>();
        for (Watch w : watches) {
            WatchSpec spec = w.getSpecs();
            String dial = (spec != null && spec.getDialFinish() != null)
                    ? spec.getDialFinish()
                    : (w.getDial() != null ? w.getDial() : "Sunray Finishing");
            String crystal = (spec != null && spec.getGlassCrystal() != null)
                    ? spec.getGlassCrystal()
                    : "Sapphire Crystal AR";
            dialMap.put(w.getId(), dial + " / " + crystal);
        }
        specs.add(new ComparisonSpecItem("Dial & Crystal", "AESTHETICS", dialMap, false));

        // 5. Strap & Buckle
        Map<String, String> strapMap = new LinkedHashMap<>();
        for (Watch w : watches) {
            WatchSpec spec = w.getSpecs();
            String strap = (spec != null && spec.getStrapMaterial() != null)
                    ? spec.getStrapMaterial()
                    : (w.getStrap() != null ? w.getStrap() : "Genuine Leather / Steel");
            String clasp = (spec != null && spec.getClaspType() != null)
                    ? spec.getClaspType()
                    : "Deployant Clasp";
            strapMap.put(w.getId(), strap + " (" + clasp + ")");
        }
        specs.add(new ComparisonSpecItem("Strap & Clasp Hardware", "ATTACHMENT", strapMap, false));

        // 6. Water Resistance
        Map<String, String> waterMap = new LinkedHashMap<>();
        for (Watch w : watches) {
            WatchSpec spec = w.getSpecs();
            String val = (spec != null && spec.getWaterResistanceAtm() != null)
                    ? spec.getWaterResistanceAtm()
                    : (w.getWaterResistance() != null ? w.getWaterResistance() : "50m (5 ATM)");
            waterMap.put(w.getId(), val);
        }
        specs.add(new ComparisonSpecItem("Water Resistance", "DURABILITY", waterMap, true));

        // 7. Power Reserve
        Map<String, String> powerMap = new LinkedHashMap<>();
        for (Watch w : watches) {
            WatchSpec spec = w.getSpecs();
            String val = (spec != null && spec.getPowerReserveHours() != null)
                    ? spec.getPowerReserveHours()
                    : ("Automatic".equalsIgnoreCase(w.getMovement()) ? "42 Hours" : "3-Year Battery");
            powerMap.put(w.getId(), val);
        }
        specs.add(new ComparisonSpecItem("Power Reserve / Battery", "ENGINEERING", powerMap, true));

        // 8. Style & Horology
        Map<String, String> styleMap = new LinkedHashMap<>();
        for (Watch w : watches) {
            String val = w.getStyle() != null ? w.getStyle() + " Horology" : "Classic Horology";
            styleMap.put(w.getId(), val);
        }
        specs.add(new ComparisonSpecItem("Style & Horology", "HOROLOGY", styleMap, false));

        // 9. Origin & Warranty
        Map<String, String> originMap = new LinkedHashMap<>();
        for (Watch w : watches) {
            WatchSpec spec = w.getSpecs();
            String origin = (w.getBrand() != null && w.getBrand().getCountry() != null)
                    ? w.getBrand().getCountry()
                    : "Switzerland";
            String warranty = (spec != null && spec.getWarrantyPeriod() != null)
                    ? spec.getWarrantyPeriod()
                    : "2-Year International Warranty";
            originMap.put(w.getId(), origin + " • " + warranty);
        }
        specs.add(new ComparisonSpecItem("Origin & Warranty", "HERITAGE", originMap, false));

        return specs;
    }
}

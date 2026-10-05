package com.wristo.modules.concierge.service;

import com.wristo.modules.catalog.dto.WatchResponse;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.concierge.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ConciergeService {

    private final WatchRepository watchRepository;

    private static final List<PrebakedInquiryDto> PREBAKED_INQUIRIES = List.of(
            new PrebakedInquiryDto(
                    "inq-green-dial",
                    "Emerald Dial Dress Watch",
                    "I desire an emerald green dial dress watch with stainless steel or leather, ideal for formal galas under ₹20,000.",
                    new ConciergePreferencesRequest(
                            List.of("black_tie", "executive_boardroom"),
                            "classic",
                            List.of("Automatic", "Quartz"),
                            "8k_to_15k",
                            List.of("Stainless Steel", "Italian Leather"),
                            "emerald green dial dress watch"
                    )
            ),
            new PrebakedInquiryDto(
                    "inq-skeleton",
                    "Open-Heart Mechanical Caliber",
                    "Looking for a mechanical skeleton timepiece showcasing exposed balance wheels and Swiss-inspired finishing.",
                    new ConciergePreferencesRequest(
                            List.of("heritage_heirloom", "daily_luxury"),
                            "classic",
                            List.of("Mechanical Skeleton", "Automatic"),
                            "15k_to_30k",
                            List.of("Surgical 316L Steel"),
                            "mechanical skeleton open heart"
                    )
            ),
            new PrebakedInquiryDto(
                    "inq-executive",
                    "Minimalist Boardroom Daily",
                    "A sleek, understated monochromatic watch suitable for daily corporate meetings and tailored suits.",
                    new ConciergePreferencesRequest(
                            List.of("executive_boardroom", "daily_luxury"),
                            "slim",
                            List.of("Quartz", "Automatic"),
                            "under_8k",
                            List.of("Black Leather", "Stainless Steel"),
                            "sleek understated minimalist boardroom"
                    )
            ),
            new PrebakedInquiryDto(
                    "inq-chrono",
                    "Precision Aviator Chronograph",
                    "High-performance chronograph with sub-dials, tachymeter scale, and adventure-grade durability.",
                    new ConciergePreferencesRequest(
                            List.of("aviation_adventure", "daily_luxury"),
                            "bold",
                            List.of("Chronograph", "Quartz"),
                            "8k_to_15k",
                            List.of("Surgical 316L Steel", "Brushed Titanium"),
                            "aviator chronograph tachymeter"
                    )
            )
    );

    public ConciergeService(WatchRepository watchRepository) {
        this.watchRepository = watchRepository;
    }

    public PrebakedInquiryResponse getPrebakedInquiries() {
        return new PrebakedInquiryResponse(PREBAKED_INQUIRIES);
    }

    public ConciergeRecommendationResponse getRecommendations(ConciergePreferencesRequest preferences) {
        List<Watch> allActiveWatches = watchRepository.findAllByIsActiveTrue(org.springframework.data.domain.PageRequest.of(0, 100)).getContent();

        List<ConciergeRecommendationDto> scoredList = allActiveWatches.stream()
                .map(watch -> scoreWatch(watch, preferences))
                .sorted((a, b) -> Integer.compare(b.getCompatibilityScore(), a.getCompatibilityScore()))
                .limit(3)
                .collect(Collectors.toList());

        String summary = generateSummaryAdvice(preferences, scoredList);
        return new ConciergeRecommendationResponse(scoredList, summary);
    }

    public ConciergeRecommendationDto scoreWatch(Watch watch, ConciergePreferencesRequest prefs) {
        OccasionScore occ = matchOccasion(watch, prefs.getOccasion());
        ErgoScore ergo = matchErgonomics(watch, prefs.getCaseErgonomics());
        MovementScore mov = matchMovement(watch, prefs.getMovement());
        int budScore = matchBudget(watch, prefs.getBudgetTier());
        KeywordScore promptScore = matchPromptKeywords(watch, prefs.getNaturalPrompt());

        int totalRaw = occ.score + ergo.score + mov.score + budScore + promptScore.score;
        int compatibilityScore = Math.min(99, Math.max(86, Math.round(75 + ((float) totalRaw / 125.0f) * 24)));

        String reasoning = watch.getAiReason() != null && !watch.getAiReason().isBlank() ? watch.getAiReason() : watch.getTagline();
        if (ergo.matchName != null && mov.matchName != null) {
            reasoning = "Features a " + ergo.matchName + " coupled with a " + mov.matchName +
                    ". Perfectly tailored to your lifestyle parameters, offering exquisite wrist presence and certified accuracy.";
        } else if (!occ.matched.isEmpty()) {
            reasoning = "Curated specifically for " + occ.matched.get(0) + ". The " + watch.getCaseSize() +
                    " " + watch.getMaterial() + " architecture ensures effortless elegance under any tailored cuff.";
        }

        String highlightTag = !promptScore.matches.isEmpty()
                ? "Inquiry Match: \"" + promptScore.matches.get(0) + "\""
                : (ergo.matchName != null ? ergo.matchName : (!occ.matched.isEmpty() ? occ.matched.get(0) : "Horologist Selected"));

        List<String> matchedAttrs = new ArrayList<>(occ.matched);
        if (ergo.matchName != null) matchedAttrs.add(ergo.matchName);
        if (mov.matchName != null) matchedAttrs.add(mov.matchName);

        return new ConciergeRecommendationDto(
                WatchResponse.from(watch),
                compatibilityScore,
                reasoning,
                highlightTag,
                matchedAttrs
        );
    }

    private static class OccasionScore {
        int score;
        List<String> matched = new ArrayList<>();
    }

    private OccasionScore matchOccasion(Watch watch, List<String> occasions) {
        OccasionScore res = new OccasionScore();
        if (occasions == null || occasions.isEmpty()) {
            res.score = 20;
            res.matched.add("Universal Versatility");
            return res;
        }

        int score = 0;
        String style = watch.getStyle() != null ? watch.getStyle().toLowerCase() : "";
        String desc = watch.getDescription() != null ? watch.getDescription().toLowerCase() : "";

        for (String occ : occasions) {
            if ("black_tie".equalsIgnoreCase(occ)) {
                if (style.contains("dress") || desc.contains("formal") || desc.contains("gala")) {
                    score += 25;
                    res.matched.add("Black Tie & Formal Elegance");
                }
            } else if ("executive_boardroom".equalsIgnoreCase(occ)) {
                if (style.contains("minimal") || style.contains("classic") || desc.contains("business") || desc.contains("executive")) {
                    score += 25;
                    res.matched.add("Executive Boardroom Synergy");
                }
            } else if ("aviation_adventure".equalsIgnoreCase(occ)) {
                if (style.contains("chronograph") || style.contains("sport") || desc.contains("aviation") || desc.contains("adventure")) {
                    score += 25;
                    res.matched.add("Aviation & Adventure Durability");
                }
            } else if ("daily_luxury".equalsIgnoreCase(occ)) {
                if (style.contains("classic") || desc.contains("daily") || desc.contains("everyday")) {
                    score += 25;
                    res.matched.add("Effortless Daily Luxury");
                }
            } else if ("heritage_heirloom".equalsIgnoreCase(occ)) {
                if ((watch.getMovement() != null && watch.getMovement().toLowerCase().contains("automatic")) ||
                        (watch.getPrice() != null && watch.getPrice().compareTo(BigDecimal.valueOf(12000)) > 0)) {
                    score += 25;
                    res.matched.add("Horological Heritage Investment");
                }
            }
        }
        res.score = Math.min(score, 30);
        return res;
    }

    private static class ErgoScore {
        int score;
        String matchName;
    }

    private ErgoScore matchErgonomics(Watch watch, String preference) {
        ErgoScore res = new ErgoScore();
        int diameter = parseCaseDiameter(watch.getCaseSize());

        if (preference == null || "any".equalsIgnoreCase(preference)) {
            res.score = 20;
            res.matchName = diameter + "mm Balanced Case";
            return res;
        }

        if ("slim".equalsIgnoreCase(preference)) {
            if (diameter <= 39) {
                res.score = 25;
                res.matchName = "Ultra-Slim " + diameter + "mm Profile";
            } else if (diameter == 40) {
                res.score = 18;
                res.matchName = "Tailored 40mm Profile";
            } else {
                res.score = 5;
            }
        } else if ("classic".equalsIgnoreCase(preference)) {
            if (diameter >= 40 && diameter <= 42) {
                res.score = 25;
                res.matchName = "Golden Ratio " + diameter + "mm Case";
            } else {
                res.score = 12;
            }
        } else if ("bold".equalsIgnoreCase(preference)) {
            if (diameter >= 42) {
                res.score = 25;
                res.matchName = "Authoritative " + diameter + "mm Presence";
            } else {
                res.score = 10;
            }
        } else {
            res.score = 15;
        }
        return res;
    }

    private static class MovementScore {
        int score;
        String matchName;
    }

    private MovementScore matchMovement(Watch watch, List<String> movements) {
        MovementScore res = new MovementScore();
        if (movements == null || movements.isEmpty() || movements.contains("any")) {
            res.score = 20;
            res.matchName = watch.getMovement();
            return res;
        }

        String pMov = watch.getMovement() != null ? watch.getMovement().toLowerCase() : "";
        String style = watch.getStyle() != null ? watch.getStyle().toLowerCase() : "";

        for (String m : movements) {
            if ("Automatic".equalsIgnoreCase(m) && pMov.contains("automatic")) {
                res.score = 25;
                res.matchName = "Mechanical Sweep Automatic";
                return res;
            }
            if ("Mechanical Skeleton".equalsIgnoreCase(m) && (pMov.contains("skeleton") || style.contains("skeleton"))) {
                res.score = 25;
                res.matchName = "Exposed Mechanical Architecture";
                return res;
            }
            if ("Chronograph".equalsIgnoreCase(m) && (style.contains("chronograph") || pMov.contains("chronograph"))) {
                res.score = 25;
                res.matchName = "Precision Multi-Dial Chrono";
                return res;
            }
            if ("Quartz".equalsIgnoreCase(m) && pMov.contains("quartz")) {
                res.score = 25;
                res.matchName = "High-Torque Quartz Caliber";
                return res;
            }
        }
        res.score = 10;
        return res;
    }

    private int matchBudget(Watch watch, String budgetTier) {
        if (watch.getPrice() == null || budgetTier == null || "all".equalsIgnoreCase(budgetTier)) return 15;
        double p = watch.getPrice().doubleValue();

        if ("under_8k".equalsIgnoreCase(budgetTier) && p <= 8000) return 20;
        if ("8k_to_15k".equalsIgnoreCase(budgetTier) && p >= 8000 && p <= 15000) return 20;
        if ("15k_to_30k".equalsIgnoreCase(budgetTier) && p >= 15000 && p <= 30000) return 20;
        if ("above_30k".equalsIgnoreCase(budgetTier) && p > 30000) return 20;
        return 8;
    }

    private static class KeywordScore {
        int score;
        List<String> matches = new ArrayList<>();
    }

    private KeywordScore matchPromptKeywords(Watch watch, String query) {
        KeywordScore res = new KeywordScore();
        if (query == null || query.trim().isBlank()) {
            res.score = 10;
            return res;
        }

        String[] tokens = query.toLowerCase().split("\\s+");
        String textCorpus = String.join(" ",
                Objects.toString(watch.getBrandName(), ""),
                Objects.toString(watch.getModel(), ""),
                Objects.toString(watch.getDescription(), ""),
                Objects.toString(watch.getTagline(), ""),
                Objects.toString(watch.getDial(), ""),
                Objects.toString(watch.getMaterial(), ""),
                Objects.toString(watch.getStrap(), "")
        ).toLowerCase();

        int hits = 0;
        for (String t : tokens) {
            if (t.length() > 2 && textCorpus.contains(t)) {
                hits++;
                res.matches.add(t);
            }
        }

        res.score = Math.min(hits * 6, 25);
        return res;
    }

    private int parseCaseDiameter(String caseSize) {
        if (caseSize == null) return 40;
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(caseSize);
        return matcher.find() ? Integer.parseInt(matcher.group()) : 40;
    }

    private String generateSummaryAdvice(ConciergePreferencesRequest prefs, List<ConciergeRecommendationDto> recs) {
        if (recs.isEmpty()) {
            return "Our horological vault contains exceptional calibers suited to your bespoke preferences. Explore our catalog for custom curations.";
        }
        ConciergeRecommendationDto top = recs.get(0);
        return "Based on your preference for " + String.join(", ", prefs.getOccasion()) +
                ", our master horologists have selected the " + top.getWatch().getModel() +
                " by " + top.getWatch().getBrand() + " as your definitive timepiece with a " +
                top.getCompatibilityScore() + "% style compatibility score.";
    }
}

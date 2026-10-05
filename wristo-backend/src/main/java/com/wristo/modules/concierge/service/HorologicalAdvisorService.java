package com.wristo.modules.concierge.service;

import com.wristo.modules.catalog.dto.WatchResponse;
import com.wristo.modules.catalog.entity.Watch;
import com.wristo.modules.catalog.repository.WatchRepository;
import com.wristo.modules.concierge.dto.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class HorologicalAdvisorService {

    private final GeminiClient geminiClient;
    private final ConciergeService conciergeService;
    private final WatchRepository watchRepository;

    public HorologicalAdvisorService(GeminiClient geminiClient,
                                     ConciergeService conciergeService,
                                     WatchRepository watchRepository) {
        this.geminiClient = geminiClient;
        this.conciergeService = conciergeService;
        this.watchRepository = watchRepository;
    }

    public ConciergeChatResponse chat(ConciergeChatRequest request) {
        String userMessage = request.getMessage() != null ? request.getMessage().trim() : "";

        // Build preferences from natural prompt
        ConciergePreferencesRequest inferredPrefs = inferPreferences(userMessage);
        List<ConciergeRecommendationDto> recommendations = conciergeService.getRecommendations(inferredPrefs).getRecommendations();

        // 1. Attempt Gemini Generation
        String systemPrompt = buildSystemPrompt();
        List<Map<String, String>> history = request.getConversationHistory().stream()
                .map(m -> Map.of("role", m.getRole(), "content", m.getContent()))
                .collect(Collectors.toList());

        Optional<String> geminiReply = geminiClient.generateAdvisorResponse(systemPrompt, userMessage, history);

        if (geminiReply.isPresent()) {
            return new ConciergeChatResponse(geminiReply.get(), recommendations);
        }

        // 2. Deterministic High-Luxury Horological Fallback Engine
        String fallbackReply = generateFallbackReply(userMessage, recommendations);
        return new ConciergeChatResponse(fallbackReply, recommendations);
    }

    private ConciergePreferencesRequest inferPreferences(String query) {
        String lower = query.toLowerCase();
        List<String> occasions = new ArrayList<>();
        List<String> movements = new ArrayList<>();
        List<String> materials = new ArrayList<>();
        String budgetTier = "all";
        String ergo = "classic";

        if (lower.contains("black tie") || lower.contains("formal") || lower.contains("gala") || lower.contains("tuxedo") || lower.contains("wedding")) {
            occasions.add("black_tie");
        }
        if (lower.contains("boardroom") || lower.contains("office") || lower.contains("meeting") || lower.contains("executive") || lower.contains("suit")) {
            occasions.add("executive_boardroom");
        }
        if (lower.contains("chrono") || lower.contains("sport") || lower.contains("adventure") || lower.contains("aviation") || lower.contains("diver")) {
            occasions.add("aviation_adventure");
        }
        if (lower.contains("daily") || lower.contains("everyday") || lower.contains("casual")) {
            occasions.add("daily_luxury");
        }
        if (lower.contains("heirloom") || lower.contains("heritage") || lower.contains("collector") || lower.contains("investment")) {
            occasions.add("heritage_heirloom");
        }

        if (lower.contains("automatic")) movements.add("Automatic");
        if (lower.contains("skeleton") || lower.contains("open heart")) movements.add("Mechanical Skeleton");
        if (lower.contains("chronograph")) movements.add("Chronograph");
        if (lower.contains("quartz")) movements.add("Quartz");

        if (lower.contains("leather")) materials.add("Italian Leather");
        if (lower.contains("steel") || lower.contains("316l")) materials.add("Stainless Steel");
        if (lower.contains("titanium")) materials.add("Brushed Titanium");

        if (lower.contains("under 8000") || lower.contains("under 8k") || lower.contains("under ₹8,000")) budgetTier = "under_8k";
        else if (lower.contains("under 15000") || lower.contains("under 15k") || lower.contains("under 20000") || lower.contains("under 20k")) budgetTier = "8k_to_15k";
        else if (lower.contains("under 30000") || lower.contains("under 30k")) budgetTier = "15k_to_30k";
        else if (lower.contains("luxury") || lower.contains("premium")) budgetTier = "15k_to_30k";

        if (lower.contains("slim") || lower.contains("thin") || lower.contains("under 39mm")) ergo = "slim";
        else if (lower.contains("bold") || lower.contains("large") || lower.contains("44mm") || lower.contains("42mm")) ergo = "bold";

        return new ConciergePreferencesRequest(occasions, ergo, movements, budgetTier, materials, query);
    }

    private String buildSystemPrompt() {
        return "You are WRISTO's Private Horological Concierge, an elite Swiss watch advisor and curator for distinguished collectors. " +
                "You provide refined, articulate, and knowledgeable guidance on mechanical calibers, case metallurgy, dial finishes, and styling aesthetics. " +
                "Ground your answers in the WRISTO vault catalog (featuring brands like AUREN, Titan, Fastrack, Casio, etc.), highlighting case diameters, exhibition casebacks, and water resistance.";
    }

    private String generateFallbackReply(String userMessage, List<ConciergeRecommendationDto> recs) {
        if (recs.isEmpty()) {
            return "Welcome to the WRISTO Vault. Our private collection features 40 master timepieces spanning automatic sweep movements, precision chronographs, and haute horology calibers. How may I guide your selection today?";
        }

        ConciergeRecommendationDto primary = recs.get(0);
        WatchResponse watch = primary.getWatch();

        StringBuilder sb = new StringBuilder();
        sb.append("For your horological inquiry, I strongly recommend the **")
                .append(watch.getBrand())
                .append(" ")
                .append(watch.getModel())
                .append("** (")
                .append(watch.getId())
                .append("). ");

        if (watch.getMovement() != null) {
            sb.append("This timepiece features a certified ")
                    .append(watch.getMovement())
                    .append(" encased in ")
                    .append(watch.getCaseSize())
                    .append(" ")
                    .append(watch.getMaterial())
                    .append(" architecture. ");
        }

        if (primary.getEditorialReasoning() != null) {
            sb.append(primary.getEditorialReasoning());
        }

        if (recs.size() > 1) {
            ConciergeRecommendationDto secondary = recs.get(1);
            sb.append(" As an alternative perspective, the **")
                    .append(secondary.getWatch().getModel())
                    .append("** by ")
                    .append(secondary.getWatch().getBrand())
                    .append(" also pairs impeccably with your requirements.");
        }

        return sb.toString();
    }
}

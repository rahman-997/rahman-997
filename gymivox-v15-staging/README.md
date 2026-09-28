# GYMIVOX v15 staging

This branch stages the modular frontend work that will be copied into the Floot production app after the daily build limit resets.

Backend already live in Supabase:
- 27 program workout days
- 111 program exercises
- 20 course lessons
- nutrition_profiles + nutrition_entries
- 113 AR/TR/EN translation keys
- start_program_plan RPC
- complete_course_lesson RPC
- update_program_progress RPC
- get_workout_analytics RPC
- get_nutrition_day RPC
- get_smart_dashboard RPC

Staged frontend:
- helpers/i18n.tsx
- pages/programs.tsx
- pages/courses.tsx
- pages/nutrition.tsx
- pages/analytics.tsx
- pages/dashboard-v15.tsx

Target Floot paths are the same names without the gymivox-v15-staging prefix.

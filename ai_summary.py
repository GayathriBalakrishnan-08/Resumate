from transformers import T5Tokenizer, T5ForConditionalGeneration
from sentence_transformers import SentenceTransformer, util
import torch

# Initialize once
tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-base")
model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-base")

# Ensure that the model is moved to the correct device (GPU if available, otherwise CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

def generate_summary(user_data):
    print("📨 user_data received in summary generator:", user_data)

    try:
        if not isinstance(user_data, dict):
            print(f"⚠️ Received invalid user_data type: {type(user_data)}")
            raise ValueError("Expected dictionary data, but got a different type.")

        role = user_data.get("role", "Banking Officer")  # Default updated for user case
        skills = user_data.get("skills", [])
        experience = user_data.get("experience", [])
        job_description = user_data.get("job_description", "")

        if isinstance(experience, list):
            if len(experience) == 1 and experience[0].lower() in ["na", "none", "fresher"]:
                years = "0 years"
            else:
                years = f"{len(experience)} years"
        elif isinstance(experience, str):
            years = experience
        else:
            years = str(experience)

        if job_description and skills:
            sbert = SentenceTransformer('all-mpnet-base-v2')
            jd_embedding = sbert.encode(job_description, convert_to_tensor=True)
            skills_embedding = sbert.encode(skills, convert_to_tensor=True)
            similarity_scores = util.pytorch_cos_sim(jd_embedding, skills_embedding)
            top_skills_indices = similarity_scores.argsort(descending=True)[0][:5]
            top_skills = [skills[i] for i in top_skills_indices]
        else:
            top_skills = skills[:5]

        skill_str = ", ".join(top_skills)

        prompt = (
            f"Write a professional resume summary in first-person point of view.\n\n"
            f"Role I'm applying for: {role}\n"
            f"Years of experience: {years}\n"
            f"My skills: {skill_str}\n"
            f"Job description: {job_description}\n\n"
            f"The summary should be concise, tailored to the role, and optimized for ATS systems. "
            f"Keep the tone confident and formal as if written by the applicant."
        )

        input_ids = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512).input_ids

        # Move the input_ids to the device (GPU/CPU)
        input_ids = input_ids.to(device)

        output = model.generate(input_ids=input_ids, max_new_tokens=120)

        return tokenizer.decode(output[0], skip_special_tokens=True)

    except Exception as e:
        print("❌ Error inside generate_summary:", e)
        return "Error generating summary."

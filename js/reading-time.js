// حساب وقت القراءة تلقائياً
function calculateReadingTime() {
    // جيب كل عناصر وقت القراءة
    const readingTimeElements = document.querySelectorAll('.reading-time');
    
    readingTimeElements.forEach(element => {
        // جيب الـ post card اللي فيه العنصر ده
        const postCard = element.closest('.post');
        
        if (!postCard) return;
        
        // جيب كل النص من الـ post
        const text = postCard.innerText || postCard.textContent;
        
        // احسب عدد الكلمات
        const wordCount = text.trim().split(/\s+/).length;
        
        // متوسط سرعة القراءة: 200 كلمة في الدقيقة
        const wordsPerMinute = 200;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        
        // حط الوقت في العنصر
        element.textContent = `${readingTime} min read`;
    });
}

// شغل الدالة لما الصفحة تحمل
document.addEventListener('DOMContentLoaded', calculateReadingTime);

// Calendar functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Generate calendar days
            const daysGrid = document.querySelector('.days-grid');
            const today = new Date();
            const currentDate = today.getDate();
            
            // Create empty cells for days before the first day of the month
            for (let i = 0; i < 5; i++) {
                const emptyCell = document.createElement('div');
                daysGrid.appendChild(emptyCell);
            }
            
            // Create cells for each day of the month
            for (let day = 1; day <= 30; day++) {
                const dayCell = document.createElement('div');
                dayCell.textContent = day;
                
                // Mark current day
                if (day === currentDate) {
                    dayCell.classList.add('current-day');
                }
                
                // Mark days with appointments (random for demo)
                if (day === 5 || day === 12 || day === 19 || day === 25 || day === 28) {
                    dayCell.classList.add('has-appointment');
                }
                
                daysGrid.appendChild(dayCell);
            }
            
            // Modal functionality
            const modal = document.getElementById('appointment-modal');
            const openModalBtn = document.getElementById('new-appointment-btn');
            const closeModalBtns = document.querySelectorAll('.close-modal');
            
            openModalBtn.addEventListener('click', function() {
                modal.style.display = 'flex';
            });
            
            closeModalBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    modal.style.display = 'none';
                });
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // Form submission
            const appointmentForm = document.getElementById('appointment-form');
            appointmentForm.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Cita agendada exitosamente!');
                modal.style.display = 'none';
                appointmentForm.reset();
            });
        });

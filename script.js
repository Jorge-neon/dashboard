const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    let circles = [];
    let selectedCircleIndex = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    function drawCircles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach((circle, index) => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = index === selectedCircleIndex ? "red" : "blue";
        ctx.fill();
      });
    }

    function getCircleAtPosition(x, y) {
      return circles.findIndex(circle => {
        const dx = x - circle.x;
        const dy = y - circle.y;
        return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
      });
    }

    canvas.addEventListener("mousedown", function(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const index = getCircleAtPosition(x, y);

      if (index !== -1) {
        selectedCircleIndex = index;
        dragOffset.x = x - circles[index].x;
        dragOffset.y = y - circles[index].y;
        isDragging = true;
      } else {
        selectedCircleIndex = null;
        circles.push({ x: x, y: y, radius: 20 });
      }
      drawCircles();
    });

    canvas.addEventListener("mousemove", function(e) {
      if (isDragging && selectedCircleIndex !== null) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        circles[selectedCircleIndex].x = x - dragOffset.x;
        circles[selectedCircleIndex].y = y - dragOffset.y;

        drawCircles();
      }
    });

    canvas.addEventListener("mouseup", function() {
      isDragging = false;
    });

    canvas.addEventListener("wheel", function(e) {
      if (selectedCircleIndex !== null) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 2 : -2;
        let newRadius = circles[selectedCircleIndex].radius + delta;
        circles[selectedCircleIndex].radius = Math.max(newRadius, 5);
        drawCircles();
      }
    });

    window.addEventListener("keydown", function(e) {
      if (e.key === "Delete" && selectedCircleIndex !== null) {
        circles.splice(selectedCircleIndex, 1);
        selectedCircleIndex = null;
        drawCircles();
      }
    });

    function setBackgroundColor() {
      let width = window.innerWidth;
      document.body.classList.remove('bg-blue', 'bg-green', 'bg-orange');
      if (width < 600) {
        document.body.classList.add('bg-blue');
      } else if (width >= 601 && width < 992) {
        document.body.classList.add('bg-green');
      } else {
        document.body.classList.add('bg-orange');
      }
    }
    setBackgroundColor();
    window.addEventListener('resize', setBackgroundColor);
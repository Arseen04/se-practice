def can_book(start, end, now, blocked, existing) -> bool:
    """Return True only when AC1-AC4 all hold; never modify `existing`."""
    # AC1: all three times must be plain integers (bool is rejected too)
    if type(start) is not int or type(end) is not int or type(now) is not int:
        return False

    # AC1: 0 <= start < end <= 1440, and start strictly after now
    if not (0 <= start < end <= 1440):
        return False
    if start <= now:
        return False

    # AC2: at most 120 minutes (exactly 120 is allowed)
    if end - start > 120:
        return False

    # AC3: a blocked room rejects every request
    if blocked:
        return False

    # AC4: overlap with any booking; touching at an endpoint is NOT overlap
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False

    return True